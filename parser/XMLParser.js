var fs = require('fs');
var XmlStream = require('xml-stream');
var config = require('../config');

module.exports.getElements = function(elementName, callback) {

    var file = fs.createReadStream(config.dumpLocation);
    var stream = new XmlStream(file);
    stream.preserve(elementName);
    stream.on('endElement: ' + elementName, function (element) {
        callback(element);
    });
};

module.exports.extractData = function(element){
    return {title: element.title.$text,
        content: element.revision.text.$text,
        timestamp: element.revision.timestamp.$text,
        id: element.id.$text,
        url: "https://en.wikipedia.org/?curid=" + element.id.$text
    };
};