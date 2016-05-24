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



/*
var r = [{ id: 9384,
    score: 1.1635296,
    categories: [ 'Non-classical logic', 'Philosophy of logic' ] },
{ id: 12283,
    score: 0.9995776,
    categories: [ 'Model theory', 'Logic', 'Mathematical logic' ] },
{ id: 22842,
    score: 0.8621334,
    categories:
    [ 'Articles created via the Article Wizard',
        'Computational complexity theory',
        'Logic in computer science',
        'Automated theorem proving',
        'Propositional calculus',
        'Systems of formal logic' ] },
{ id: 2207,
    score: 0.8408314,
    categories:
    [ 'Fuzzy logic',
        'Artificial intelligence',
        'Logic in computer science',
        'Non-classical logic',
        'Probability interpretations',
        'Azerbaijani inventions' ] },
{ id: 2465,
    score: 0.8198627,
    categories: [ 'Classical logic', 'Logic', 'Term logic', 'History of logic' ] },
{ id: 2205,
    score: 0.81789154,
    categories:
    [ 'Fuzzy logic',
        'Artificial intelligence',
        'Logic in computer science',
        'Non-classical logic',
        'Probability interpretations',
        'Azerbaijani inventions' ] },
{ id: 4143,
    score: 0.7809806,
    categories:
    [ 'Knowledge representation languages',
        'Non-classical logic',
        'Information science',
        'Artificial intelligence' ] },
{ id: 2204,
    score: 0.7771165,
    categories:
    [ 'Fuzzy logic',
        'Artificial intelligence',
        'Logic in computer science',
        'Non-classical logic',
        'Probability interpretations',
        'Azerbaijani inventions' ] },
{ id: 17374,
    score: 0.77520823,
    categories:
    [ 'Semantics',
        'Model theory',
        'Formal languages',
        'Philosophy of mind',
        'Philosophy of language',
        'Interpretation (philosophy)',
        'Interpretation' ] },
{ id: 17375,
    score: 0.76370555,
    categories:
    [ 'Semantics',
        'Model theory',
        'Formal languages',
        'Philosophy of mind',
        'Philosophy of language',
        'Interpretation (philosophy)',
        'Interpretation' ] },
{ id: 17969,
    score: 0.74090326,
    categories: [ 'Object-oriented programming' ] },
{ id: 10234,
    score: 0.72138304,
    categories: [ 'Mathematical logic' ] },
{ id: 15490,
    score: 0.7068081,
    categories: [ 'Mathematical logic', 'Model theory' ] },
{ id: 22649, score: 0.7068081, categories: [ 'Model theory' ] },
{ id: 16491,
    score: 0.68157625,
    categories: [ 'Mathematical logic' ] },
{ id: 14087,
    score: 0.6678412,
    categories:
    [ 'Mathematical logic',
        'Propositional calculus',
        'Logic symbols' ] },
{ id: 16492,
    score: 0.65852964,
    categories: [ 'Mathematical logic' ] },
{ id: 3875,
    score: 0.651911,
    categories: [ 'Mathematical logic', 'Metalogic' ] },
{ id: 21463,
    score: 0.6513052,
    categories: [ 'Mathematical logic', 'Set theory' ] },
{ id: 21464,
    score: 0.6513052,
    categories: [ 'Mathematical logic', 'Set theory' ] }];


var c = [ 'Semantics',
    'Model theory',
    'Logic',
    'Philosophy of mind',
    'Philosophy of language',
    'Interpretation (philosophy)',
    'Interpretation' ];

console.log(exports.pickBestCategory(r,c));*/
