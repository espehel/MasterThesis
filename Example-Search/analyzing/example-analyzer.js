var relevantExamples = require("./relevantExamples.json");



module.exports.splitInTwo = function (examples) {
    return {left: examples.slice(0,examples.length/2), right: examples.slice(examples.length/2, examples.length)}
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

module.exports.pickBestCategory = function(results, categories) {

    var bestCategorySet = categories.slice();

    for(var i = 0; i < results.length; i++ ) {

        //console.log(bestCategorySet);
        var tempCats = [];

        results[i].categories.forEach(function (cat) {
            if (bestCategorySet.indexOf(cat) != -1) {
                tempCats.push(cat);
            }
        });

        if (tempCats.length == 1) {
            return tempCats[0];
        }
        if (tempCats.length > 1) {
            bestCategorySet = tempCats;
        }
    }
    return bestCategorySet[0];
};

function compare(cats1, cats2) {
    var matches = 0;
    cats1.forEach(function (cat1) {
        cats2.forEach(function (cat2) {
            if(cat1.toLowerCase() == cat2.toLowerCase()) {
                matches += 1;
            }
        })
    })
    return matches;
}

module.exports.order = function (similarExamples, example) {
    var left = [];
    var right = [];
    similarExamples.forEach(function (entry) {
        entry.score = compare(entry._source.categories, example._source.categories) / example._source.categories.length;
        if(entry.score == 1) {
            left.push(entry);
        } else {
            right.push(entry);
        }
    })
    right.sort(function (a, b) {
        return b.score - a.score;
    })
    return {left: left,  right: right.slice(0, 10)};
};

module.exports.checkRelevance = function (example, search) {
    if (relevantExamples[search]) {
        if (relevantExamples[search].relevant.indexOf(example._source.id) != -1) {
            example.relevant = true;
        } else if (relevantExamples[search].irrelevant.indexOf(example._source.id) != -1) {
            example.irrelevant = true;
        }
    }
}

