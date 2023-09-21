/**
 * Sleep in ms
 *
 * @param {*} ms
 * @return {*} 
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function equalSet(xs, ys) {
    return xs.size === ys.size &&
    [...xs].every((x) => ys.has(x));
}
    

module.exports = {sleep, equalSet};