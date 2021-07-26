import * as IJS from 'image-js';

/**
 * Create an `HTMLImageElement` from a `File`, `IJS.Image` or `HTMLCanvasElement` object.
 *
 * @param {File | IJS.Image | HTMLCanvasElement} x
 * @returns {Promise<HTMLImageElement>}
 */
export function toHTMLImage(x) {
    return new Promise((resolve) => {
        let img = new Image();
        img.onload = () => {
            resolve(img);
        };
        if (x instanceof File) {
            let reader = new FileReader();
            reader.readAsDataURL(x);
            reader.onload = () => (img.src = reader.result);
        } else {
            img.src = x.toDataURL();
        }
    });
}

/**
 * Create an `IJS.Image` from an `HTMLImageElement` object.
 *
 * @param {HTMLImageElement} x
 * @returns {IJS.Image}
 */
 export function toIJSImage(img) {
    let canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    return IJS.Image.fromCanvas(canvas);
}
