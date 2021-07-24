import * as IJS from 'image-js';

/**
 * Create an `IJS.Image` from a `File` object.
 * The file must be an image file.
 *
 * @param {File} file
 * @returns {Promise<IJS.Image>}
 */
export function fileToIJS(file) {
    return new Promise((resolve) => {
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
 * @returns {Promise<Image>}
 */
export function IJStoImage(ijsImg) {
    return new Promise((resolve) => {
        let img = new Image();
        img.onload = () => {
            resolve(img);
        };
        img.src = ijsImg.toDataURL();
    });
}

/**
 *
 * @param {HTMLCanvasElement} canvas
 * @returns {Promise<Image>}
 */
export function canvasToImage(canvas) {
    return new Promise((resolve) => {
        let img = new Image();
        img.onload = () => {
            resolve(img);
        };
        img.src = canvas.toDataURL();
    });
}
