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

function subset(small_set, big_set) {
    return [...small_set].every(val => big_set.has(val));
}
    

module.exports = {sleep, equalSet, subset};