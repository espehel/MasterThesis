
module.exports.splitInTwo = function (examples) {
    return {left: examples.splice(0,examples.length/2), right: examples.splice(examples.length/2, examples.length)}
};