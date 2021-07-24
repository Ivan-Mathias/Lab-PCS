import * as IJS from 'image-js';

/**
 * Create an `IJS.Image` from a `File` object.
 * The file must be an image file.
 *
 * @param {File} file
 * @returns {IJS.Image}
 */
export async function fileToIJS(file) {
  return await new Promise(resolve => {
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
  return await new Promise(resolve => {
    let img = new Image();
    img.onload = () => {
      resolve(img);
    };
    img.src = ijsImg.toDataURL();
  });
}
