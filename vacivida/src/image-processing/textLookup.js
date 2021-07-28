const MAX_SENT_DISTANCE_PX = 50;
const MAX_EDIT_DISTANCE = 2;

/**
 * Converts a string to lower case, removes accents and punctuation,
 * and normalizes whitespace.
 *
 * @param {string} s
 * @returns {string} The normalized string
 */
function normalize(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[-.,:/]/g, ' ')
    .replace(/\s+/, ' ')
    .trim();
}

/**
 * Calculates the (Levenshtein) edit distance between two strings.
 *
 * @param {string} s1
 * @param {string} s2
 * @returns {number} The edit distance between s1 and s2.
 */
function editDistance(s1, s2) {
  if (s1.length === 0) return s2.length;
  if (s2.length === 0) return s1.length;

  // The code below uses dynamic programming to
  // efficiently implement the following recursion:
  //   function editDistance(s1, s2) {
  //     if (s1.length == 0) {
  //       return s2.length;
  //     } else if (s2.length == 0) {
  //       return s1.length;
  //     } else if (s1[-1] == s2[-1]) {
  //       return editDistance(s1[:-1], s2[:-1]);
  //     } else {
  //       return 1 + min(editDistance(s1[:-1], s2), editDistance(s1, s2[:-1]), editDistance(s1[:-1], s2[:-1]));
  //     }
  //   }

  let mem = [Array(s2.length), Array(s2.length)];
  for (let j = 0; j < s2.length; j++) mem[1][j] = j;

  for (let i = 1; i < s1.length; i++) {
    mem = [mem[1], mem[0]];
    mem[1][0] = i;
    for (let j = 1; j < s2.length; j++) {
      if (s1[i] === s2[j]) {
        mem[1][j] = mem[0][j - 1];
      } else {
        mem[1][j] = 1 + Math.min(mem[1][j - 1], mem[0][j], mem[0][j - 1]);
      }
    }
  }

  return mem[1][s2.length - 1];
}

/**
 * Tries to find a block with the specified key, and returns any values
 * associated with that block. For the details on how the associated
 * values are found, see `findText`.
 *
 * A block is considered valid for the specified key if the `editDistance`
 * between the normalized key and block text is <= `MAX_EDIT_DISTANCE`.
 *
 * @param {array} blocks The blocks returned by worker.recognize(img)
 * @param {string} key The key to look for
 * @param {number} maxNumValues The maximum number of values to return
 * @returns A (possibly empty) list of values
 */
export function ocrKeyLookup(blocks, key, maxNumValues) {
  // For each d = 0 to MAX_EDIT_DISTANCE, try to find a block
  // with edit distance == d.
  // Note: this is inefficient because we're recalculating
  // the same edit distances in each iteration of the outer loop.
  for (let d = 0; d <= MAX_EDIT_DISTANCE; d++) {
    for (let b of blocks) {
      if (editDistance(normalize(b.text), normalize(key)) === d) {
        let values = findText(b.bbox, blocks, maxNumValues);
        if (values.length > 0) {
          return values;
        }
      }
    }
  }
  return [];
}

/**
 * Tries to find a list of values either to the right or below `refBbox`.
 *
 * Each value is made up of a set of blocks that are in the same line and
 * are separated horizontally by no more than `MAX_SENT_DISTANCE_PX` pixels.
 *
 * The values should be distributed verticaly, i.e., one value per line.
 *
 * @param {object} refBbox The reference bounding box, with keys x0, y0, x1, y1.
 * @param {array} blocks The blocks returned by worker.recognize(img)
 * @param {number} maxNumValues The maximum number of values to return
 * @returns {array} A (possibly empty) list of values
 */
function findText(refBbox, blocks, maxNumValues) {
  // Try to find the first value (either to the right or below refBbox)
  let result = findTextRight(refBbox, blocks);
  if (result == null) result = findTextBelow(refBbox, blocks);
  if (result == null) return [];

  let [valueBbox, value] = result;
  let values = [value];

  // Try to find the remaining values in a vertical list.
  for (let i = 1; i < maxNumValues; i++) {
    result = findTextBelow(valueBbox, blocks);
    if (result == null) break;
    [valueBbox, value] = result;
    values.push(value);
  }

  return values;
}

/**
 * Tries to find a value to the right of refBbox, separated horizontally
 * by no more than `MAX_SENT_DISTANCE_PX` pixels.
 *
 * @param {object} refBbox The reference bounding box, with keys x0, y0, x1, y1.
 * @param {array} blocks The blocks returned by worker.recognize(img)
 * @returns {array} A (possibly empty) list of values
 */
function findTextRight(refBbox, blocks) {
  let matches = [];
  for (let b of blocks) {
    let isSameLine = refBbox.y0 < b.bbox.y1 && b.bbox.y0 < refBbox.y1;
    let isRight = refBbox.x1 < b.bbox.x0;
    if (isSameLine && isRight) matches.push(b);
  }

  let result = joinBlocks(matches);
  if (result == null || result[0].x0 - refBbox.x1 > MAX_SENT_DISTANCE_PX) return null;
  return result;
}

/**
 * Tries to find a value below refBbox, separated vertically
 * by no more than 2*height of refBbox.
 *
 * @param {object} refBbox The reference bounding box, with keys x0, y0, x1, y1.
 * @param {array} blocks The blocks returned by worker.recognize(img)
 * @returns {array} A (possibly empty) list of values
 */
function findTextBelow(refBbox, blocks) {
  let matches = [];
  for (let b of blocks) {
    let isNextLine = refBbox.y1 < b.bbox.y0 && b.bbox.y0 < refBbox.y1 + 2 * (refBbox.y1 - refBbox.y0);
    let isLeft = b.bbox.x1 < refBbox.x0;
    if (!isLeft && isNextLine) {
      matches.push(b);
    }
  }

  let result = joinBlocks(matches);
  if (result == null || result[0].x0 > refBbox.x1) return null;
  return result;
}

/**
 * Given a list of blocks, sort them horizontally and join their texts.
 *
 * Any blocks that are separated horizontally by more than
 * `MAX_SENT_DISTANCE_PX` pixels.
 *
 * @param {array} blocks The blocks returned by worker.recognize(img)
 * @returns {[object, string]} An array with the resulting text and its bounding box
 */
function joinBlocks(blocks) {
  if (blocks.length === 0) return null;

  blocks.sort((x, y) => (x.bbox.x0 < y.bbox.x0 ? -1 : x.bbox.x0 === y.bbox.x0 ? 1 : 0));

  let bbox = { ...blocks[0].bbox };
  let result = [blocks[0]];
  for (let b of blocks.slice(1)) {
    if (b.bbox.x0 - bbox.x1 > MAX_SENT_DISTANCE_PX) break;
    result.push(b);
    bbox = {
      x0: Math.min(bbox.x0, b.bbox.x0),
      y0: Math.min(bbox.y0, b.bbox.y0),
      x1: Math.max(bbox.x1, b.bbox.x1),
      y1: Math.max(bbox.y1, b.bbox.y1),
    };
  }
  return [bbox, result.map((x) => x.text.trim()).join(' ')];
}
