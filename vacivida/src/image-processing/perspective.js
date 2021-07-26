import * as math from 'mathjs';
import { toHTMLImage } from './imageUtils.js';

/**
 *
 * @param {Array<number>} arr
 * @param {} f
 * @returns {number}
 */
function argf(arr, f) {
    let max = f(arr);
    for (let i = 0; i < arr.length; i++) {
        if (max == arr[i]) return i;
    }
    return -1;
}

/**
 *
 * @param {Array<number>} arr
 * @returns {number}
 */
function argmin(arr) {
    return argf(arr, math.min);
}

/**
 *
 * @param {Array<number>} arr
 * @returns {number}
 */
function argmax(arr) {
    return argf(arr, math.max);
}

/**
 *
 * @param {Array<[number, number]>} P
 * @returns {Array<[number, number]>}
 */
export function orderPoints(P) {
    const sum = math.sum;

    let sums = math.apply(P, 1, sum);
    let A = P[argmin(sums)];
    let C = P[argmax(sums)];

    let diffs = math.diff(P, 1);
    let B = P[argmin(diffs)];
    let D = P[argmax(diffs)];

    return [A, B, C, D];
}

/**
 *
 * @param {Array<[number, number]>} src
 * @param {Array<[number, number]>} dst
 * @returns {Array<[number, number]>}
 */
export function getPerspectiveTransform(src, dst) {
    let A = [];
    let b = [];

    for (let i = 0; i < 4; i++) {
        let x = src[i][0];
        let y = src[i][1];
        let Px = dst[i][0];
        let Py = dst[i][1];

        let aux_A = [-x, -y, -1, 0, 0, 0, Px * x, Px * y];
        let aux_b = -Px;

        A.push(aux_A);
        b.push(aux_b);

        aux_A = [0, 0, 0, -x, -y, -1,Py * x, Py * y];
        aux_b = -Py;

        A.push(aux_A);
        b.push(aux_b);
    }

    let M = math.lusolve(A, b);
    M.push(1);
    M = math.reshape(M, [3, 3]);

    return M;
}

/**
 *
 * @param {HTMLImageElement} canvas
 * @param {Array<Array<number>>} M
 * @param {Array<number>} new_shape
 * @returns {Promise<Image>}
 */
export function perspectiveWarp(img, M, new_shape) {
    let [h, w] = new_shape;
    let M_inv = math.inv(M);

    let original = document.createElement('canvas');
    let originalCtx = original.getContext('2d');
    original.width = img.width;
    original.height = img.height;
    originalCtx.drawImage(img, 0, 0);

    let warped = document.createElement('canvas');
    let warpedCtx = warped.getContext('2d');
    warped.height = h;
    warped.width = w;

    for (let Px = 0; Px < w; Px++) {
        for (let Py = 0; Py < h; Py++) {
            let w_ = 1 / math.multiply(M_inv[2], [Px, Py, 1]);
            let P_warped = [[Px * w_], [Py * w_], [w_]];

            let p = math.multiply(M_inv, P_warped);
            let x = Math.round(p[0][0]);
            let y = Math.round(p[1][0]);

            let data = originalCtx.getImageData(x, y, 1, 1);
            warpedCtx.putImageData(data, Px, Py);
        }
    }

    return toHTMLImage(warped);
}

/**
 *
 * @param {Array<[number,number]>} P
 * @returns {<Array<number>}
 */
export function getShape(P) {
    let [A, B, C, D] = P;

    let widthA = math.sqrt(math.pow(C[0] - D[0], 2) + math.pow(C[1] - D[1], 2));
    let widthB = math.sqrt(math.pow(B[0] - A[0], 2) + math.pow(B[1] - A[1], 2));
    let maxWidth = math.max(widthA, widthB);

    let heightA = math.sqrt(math.pow(B[0] - C[0], 2) + math.pow(B[1] - C[1], 2));
    let heightB = math.sqrt(math.pow(A[0] - D[0], 2) + math.pow(A[1] - D[1], 2));
    let maxHeight = math.max(heightA, heightB);

    return [Math.round(maxHeight), Math.round(maxWidth)];
}

/**
 *
 * @param {Array<number>} shape
 * @returns {<Array<number>}
 */
export function createDstArray(shape) {
    let [h, w] = shape;
    return [
        [0, 0],
        [w - 1, 0],
        [w - 1, h - 1],
        [0, h - 1],
    ];
}

/**
 *
 * @param {HTMLImageElement} img
 * @param {Array<[number,number]>} points
 * @returns {Promise<Image>}
 */
export function main(img, points) {
    points = orderPoints(points);

    let newShape = getShape(points);

    let dst = createDstArray(newShape);

    let M = getPerspectiveTransform(points, dst);
    return perspectiveWarp(img, M, newShape);
}
