import * as math from "mathjs";

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
    
    let sums = math.apply(P,1,sum);
    let A = P[argmin(sums)];
    let C = P[argmax(sums)];
    
    let diffs = math.diff(P,1);
    let B = P[argmin(diffs)];
    let D = P[argmax(diffs)];

    return [A,B,C,D];
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

    for(let i = 0; i < 4 ; i++){
        let x = src[i][0];
        let y = src[i][1];
        let Px = dst[i][0];
        let Py = dst[i][1];

        let aux_A = [-x, -y, -1, 0, 0, 0, Px*x, Px*y];
        let aux_b = -Px;
        
        A.push(aux_A);
        b.push(aux_b);
        
        aux_A = [-x, -y, -1, 0, 0, 0, Px*x, Px*y];
        aux_b = -Px;

        A.push(aux_A);
        b.push(aux_b);
    }

    let M = math.lusolve(A, b);
    M.push(1);
    M = math.reshape(M, [3,3]);

    return M;
}

/**
 * 
 * @param {HTMLCanvasElement} img 
 * @param {Array<Array<number>>} M 
 * @param {Array<number>} new_shape 
 * @returns {HTMLCanvasElement}
 */
export function perspectiveWarp(img, M, new_shape) {
    let [h,w] = new_shape;
    let M_inv = math.inv(M);

    let warped = document.createElement("canvas");
    warped.height = h;
    warped.width = w;

    let warpedCtx = warped.getContext('2d');
    let imgCtx = warped.getContext('2d');

    for(let Px = 0; Px < w; Px++){
        for(let Py = 0; Py < h; Py++){
            let w_ = 1/math.multiply(M_inv[2],[Px,Py,1])[0];
            let P_warped = [[Px * w_], [Py * w_], [w_]];

            let p = multiply(M_inv, P_warped);
            let x = Math.round(p[0][0]);
            let y = Math.round(p[1][0]);

            let data = imgCtx.getImageData(x, y, 1, 1);
            warpedCtx.putImageData(data, Px, Py);
        }   
    }

    return warped;
}

/**
 * 
 * @param {Array<[number,number]>} P
 * @returns {<Array<number>}
 */
export function getShape(P){
    let [A,B,C,D] = P;

    widthA = math.sqrt(math.pow((C[0] - D[0]),2) + math.pow((C[1] - D[1]),2));
    widthB = math.sqrt(math.pow((B[0] - A[0]),2) + math.pow((B[1] - A[1]),2));
    maxWidth = math.max(widthA, widthB);
    
    heightA = math.sqrt(math.pow((B[0] - C[0]),2) + math.pow((B[1] - C[1]),2));
    heightB = math.sqrt(math.pow((A[0] - D[0]),2) + math.pow((A[1] - D[1]),2));
    maxHeight = math.max(heightA, heightB);

    return [Math.round(maxHeight), Math.round(maxWidth)];
}

/**
 * 
 * @param {Array<number>} shape
 * @returns {<Array<number>}
 */
export function createDstArray(shape){
    let [h, w] = shape;
    return  [[0,0], [w - 1, 0], [w - 1, h - 1], [0, h - 1]];
}

/**
 * 
 * @param {HTMLCanvasElement} img 
 * @param {Array<[number,number]>} points
 * @returns {HTMLCanvasElement}
 */
export function main(img, points){
    points = orderPoints(points);

    let newShape = getShape(points);

    let dst = createDstArray(newShape);

    let M = getPerspectiveTransform(img, dst);
    let warped = perspectiveWarp(img, M, newShape);

}
