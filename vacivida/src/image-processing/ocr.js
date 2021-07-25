import Tesseract from 'tesseract.js';
import { ocrKeyLookup } from './textLookup.js';
import { IJStoImage, fileToIJS } from './imageUtils.js';
import * as perspective from './perspective.js';

const alphaLower = 'aáãàâbcçdeêéfghiíîjklmnoôóöpqrstuúüvwxyz';
const alphaUpper = alphaLower.toUpperCase();
const num = '0123456789';
const punct = '.:-/';
const space = ' ';
const VALID_CHARS = alphaLower + alphaUpper + num + punct + space;

/**
 * Prepares an image for OCR.
 *
 * @param {IJS.Image} img
 * @returns {IJS.Image}
 */
function preprocessDocumentImage(img) {
  img = img.grey().resize({ height: 500, preserveAspectRatio: true });
  let arr = [...Array(7).keys()].map(() => 1);
  let bg = img.dilate({ kernel: arr.map(() => arr) }).blurFilter({ radius: 2 });
  let withoutBg = bg.subtractImage(img).invert().level({ min: 0, max: 255 });
  let min = withoutBg.getMin();
  if (min > 0) withoutBg.subtract(min);
  withoutBg.multiply(255 / withoutBg.getMax());
  return withoutBg;
}

/**
 * The main OCS application class.
 */
export class OCR {
  constructor() {
    // Event handlers
    this.onWorkerProgress = null;
    this.onPreprocessedImage = null;
    this.onOCRResults = null;

    // Create the tesseract worker and configure the worker.
    this.workerPromise = this.newWorker();
  }

  async newWorker() {
    let worker = Tesseract.createWorker({
      logger: (m) => {
        // Track progress through log messages
        if (m.status === 'recognizing text' && this.onWorkerProgress) {
          this.onWorkerProgress(m.progress);
        }
      },
      // cacheMethod: 'none',
    });

    await worker.load();
    await worker.loadLanguage('por');
    await worker.initialize('por');
    await worker.setParameters({
      user_defined_dpi: '70',
      tessedit_pageseg_mode: Tesseract.PSM.SPARSE_TEXT,
      tessedit_char_whitelist: VALID_CHARS,
    });
    return worker;
  }

  /**
   * Event handler for when a new file is added.
   */
  async processFile(file, points) {
    // Load and pre-process the image file
    let ijs = await fileToIJS(file);
    let postImg = await IJStoImage(preprocessDocumentImage(ijs));
    postImg = await perspective.main(postImg, points);
    if (this.onPreprocessedImage) {
      this.onPreprocessedImage(postImg);
    }

    // Get OCR result
    let worker = await this.workerPromise;
    let result = await worker.recognize(postImg);
    if (this.onOCRResults) {
      this.onOCRResults(result);
    }

    return {
      Nome: ocrKeyLookup(result.data.blocks, 'Nome', 1)[0],
      CPF: ocrKeyLookup(result.data.blocks, 'CPF', 1)[0],
      Filiacao: ocrKeyLookup(result.data.blocks, 'Filiação', 2).join(' e '),
      'Data de Nascimento': ocrKeyLookup(result.data.blocks, 'Data de Nascimento', 1)[0],
    };
  }
}
