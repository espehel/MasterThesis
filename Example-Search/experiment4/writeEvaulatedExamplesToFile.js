var examplesObj = require("./../analyzing/relevantExamples.json");

var chosenKeywords = ["java", "algebra", "nash equilibrium"];
var examplesArray = [];

for (var key in examplesObj) {
    if (examplesObj.hasOwnProperty(key) && chosenKeywords.indexOf(key) != -1) {
        console.log(key);
        examplesArray = examplesArray.concat(examplesObj[key].relevant)
        examplesArray = examplesArray.concat(examplesObj[key].irrelevant)
    }
}
console.log(examplesArray.length)
var fs = require('fs');

var file = fs.createWriteStream('./examples.txt');
file.on('error', function(err) { /* error handling */ });
examplesArray.forEach(function(v) { file.write(v + ('\n')); });
file.end();






