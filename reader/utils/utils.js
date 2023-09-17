/**
 * Generate depth string of given element
 *
 * @param {parser.HTMLElement} root the page's html
 * @param {parser.HTMLElement} target the element to search
 * @returns {String} depth string (Eg. 0.0.0.1.2.0.2)
 */
function get_node_depthstring(root, target, depthstring = "") {
    for (let index = 0; index < root.childNodes.length; index++) {
        if (root.childNodes[index].toString() === target.toString()) {
            return depthstring + index.toString();
        }
        let search_result = get_node_depthstring(root.childNodes[index], target, depthstring + index + ".");
        if (search_result !== "" && search_result.charAt(search_result.length - 1) !== ".") {
            return search_result;
        }
    }
    return depthstring;
}

module.exports = {get_node_depthstring};