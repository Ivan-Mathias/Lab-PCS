import Tesseract from 'tesseract.js';
import { ocrKeyLookup } from './textLookup.js';
import { toHTMLImage, toIJSImage } from './imageUtils.js';
import * as perspective from './perspective.js';

const alphaLower = 'aáãàâbcçdeêéfghiíîjklmnoôóöpqrstuúüvwxyz';
const alphaUpper = alphaLower.toUpperCase();
const num = '0123456789';
const punct = '.:-/';
const space = ' ';
const VALID_CHARS = alphaLower + alphaUpper + num + punct + space;

function matrix(rows, cols, val) {
    let mat = Array(rows);
    for (let i = 0; i < rows; i++) {
        let row = Array(cols);
        mat[i] = row;
        for (let j = 0; j < cols; j++) {
            row[j] = val;
        }
    }
    return mat;
}

function ones(rows, cols) {
    return matrix(rows, cols, 1);
}

/**
 * Prepares an image for OCR.
 *
 * @param {HTMLImageElement} img
 * @returns {Promise<HTMLImageElement>}
 */
async function preprocessDocumentImage(img, points) {
    // Perspective correction
    let now = performance.now();
    let initialHeight = img.height;
    let ijsImg = (await toIJSImage(img)).resize({ height: 1200, preserveAspectRatio: true });
    points = points.map((xy) => xy.map((w) => (w * ijsImg.height) / initialHeight));
    [ijsImg.data, ijsImg.width] = perspective.main(ijsImg.data, ijsImg.width, points);
    ijsImg.height = ijsImg.data.length / ijsImg.width / 4;
    console.debug(`[preprocessDocumentImage] Finished perspective correction in ${performance.now() - now} ms`);

    // Background removal
    now = performance.now();
    // let ijsImg = await toIJSImage(img);
    ijsImg = ijsImg.grey().resize({ height: 650, preserveAspectRatio: true });
    let bg = ijsImg
        .resize({ height: 100, preserveAspectRatio: true })
        .blurFilter({ radius: 5 })
        .resize({ height: ijsImg.height, width: ijsImg.width });
    ijsImg = bg.subtractImage(ijsImg).invert();
    ijsImg.subtract(ijsImg.getMin()[0] + 1);
    ijsImg.multiply(255 / ijsImg.getMax()[0]);
    console.debug(`[preprocessDocumentImage] Finished background removal in ${performance.now() - now} ms`);

    // Noise removal
    now = performance.now();
    let targetMean = 255 - 32;
    let mean = ijsImg.getMean()[0];
    let iterations = 0;
    while (mean > targetMean) {
        if (iterations > 30) {
            console.warn('Failed to adjust image mean value (exceeded 30 iterations)');
            break;
        }
        let x = 30 + (255 * (targetMean - mean)) / (targetMean - 255);
        ijsImg.subtract(x);
        ijsImg.multiply((255 * 1.1) / (255 - x));
        mean = ijsImg.getMean()[0];
        iterations++;
    }

    let mask = ijsImg
        .invert()
        .mask({ threshold: 0.25 })
        .dilate({ kernel: ones(7, 7) });
    img = await toHTMLImage(ijsImg.extract(mask));
    console.debug(`[preprocessDocumentImage] Finished noise removal in ${performance.now() - now} ms`);
    return img;
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

        console.debug('[newWorker] initializing worker...');
        await worker.load();
        await worker.loadLanguage('por');
        await worker.initialize('por');
        await worker.setParameters({
            user_defined_dpi: '70',
            tessedit_pageseg_mode: Tesseract.PSM.SPARSE_TEXT,
            tessedit_char_whitelist: VALID_CHARS,
            tessjs_create_hocr: '0',
            tessjs_create_tsv: '0',
        });
        console.debug('[newWorker] finished initializing worker');
        return worker;
    }

    /**
     * Event handler for when a new file is added.
     */
    async processFile(img, points) {
        // Load and pre-process the image file
        let postImg = await preprocessDocumentImage(img, points);
        if (this.onPreprocessedImage) {
            this.onPreprocessedImage(postImg);
        }

        // Get OCR result
        let worker = await this.workerPromise;
        console.debug('[processFile] worker is ready to recognize');

        let now = performance.now();
        let result = await worker.recognize(postImg);
        console.debug(`[processFile] Finished ocr in ${performance.now() - now} ms`);
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
