
module.exports.splitInTwo = function (examples) {
    return {left: examples.splice(0,examples.length/2), right: examples.splice(examples.length/2, examples.length)}
};


module.exports.getReferredFrom = function (main, examples) {

    var result = [];

    for(var i = 0; i < examples.length; i++){
        var references = examples[i]._source.references;

        for(var j = 0; j < references.length; j++) {
            if (references[j] == main._source.title.toLocaleLowerCase) {
                console.log("found");
                result.push[examples[i]];
                break;
            }
        }
    }
    return result;
};

module.exports.getRefersTo = function (main, examples) {

    var result = [];

    for(var i = 0; i < main._source.references; i++) {

        for(var j = 0; j < examples.length; j++) {

            if(main._source.references[i] = examples[j]._source.title.toLocaleLowerCase()) {
                console.log("found2");
                result.push(examples[j]);
            }
        }
    }
    return result;
};