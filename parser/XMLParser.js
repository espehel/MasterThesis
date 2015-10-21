var fs        = require('fs');
var XmlStream = require('xml-stream');
var config = require('../config');
/*
 * Pass the ReadStream object to xml-stream
 */

module.exports.getElements = function(elementName, callback) {

    //var file = fs.createReadStream('data/sample.xml');
    var file = fs.createReadStream(config.dumpLocation);
    var stream = new XmlStream(file);
    stream.preserve(elementName);
    stream.on('endElement: ' + elementName, function (element) {
        callback(element);
    });
}

module.exports.extractData = function(element){
    return {title: element.title.$text, content: element.revision.text.$text, timestamp: element.revision.timestamp.$text};
}