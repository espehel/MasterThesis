var examplesObj = require("./../analyzing/relevantExamples.json");
var es = require("../elasticsearch/api.js");







for (var key in examplesObj) {
    if (examplesObj.hasOwnProperty(key)) {
        (function (key) {
            es.search(key, function (error, result) {
                var total = examplesObj[key].relevant.length;
                var recalled = 0;
                result.forEach(function (example) {
                    if (examplesObj[key].relevant.indexOf(example._source.id) != -1) {
                        recalled++;
                    }
                });
                console.log(key + ": " + recalled + "/" + total);
            });
        })(key)
    }
}