import * as IJS from 'image-js';

/**
 * Create an `IJS.Image` from a `File` object.
 * The file must be an image file.
 *
 * @param {File} file
 * @returns {IJS.Image}
 */
export async function fileToImage(file) {
  return await new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = (readerEvent) => {
      resolve(IJS.Image.load(readerEvent.target.result));
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Convert an `IJS.Image` to a native `Image` object.
 *
 * @param {IJS.Image} ijsImg
 * @returns {Image}
 */
export async function IJStoImage(ijsImg) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => {
      resolve(img);
    };
    img.src = ijsImg.toDataURL();
  });
}

/**
 * Prepares an image for OCR.
 *
 * @param {IJS.Image} img
 * @returns {IJS.Image}
 */
export function preprocessDocumentImage(img) {
  img = img.grey().resize({ height: 500, preserveAspectRatio: true });
  let arr = [...Array(7).keys()].map(() => 1);
  let bg = img.dilate({ kernel: arr.map(() => arr) }).blurFilter({ radius: 2 });
  let withoutBg = bg.subtractImage(img).invert().level({ min: 0, max: 255 });
  let min = withoutBg.getMin();
  if (min > 0) withoutBg.subtract(min);
  withoutBg.multiply(255 / withoutBg.getMax());
  return withoutBg;
}
