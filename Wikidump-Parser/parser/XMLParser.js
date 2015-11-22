var fs = require('fs');
var XmlStream = require('xml-stream');
var config = require('../config');
var saxStream = require("sax").createStream(true);

module.exports.getElements = function(elementName, callback) {


    var inPage = false;
    var inText = false;
    var element = null;
    var inTitle = false;
    var inId = false;
    var inTimestamp = false;
    var tagStack = [];

    saxStream.on("error", function (e) {
        // unhandled errors will throw, since this is a proper node
        // event emitter.
        console.error("error!", e);
        // clear the error
        this._parser.error = null;
        this._parser.resume();
    });
    saxStream.on("opentag", function (tag) {

        //this is the root element and this will be called first and only once.
        //if (tag.name = "mediawiki") {
            //this._parser.line = config.startLine;
        //}

        if (tag.name == "page") {
            inPage = true;
            element = {};
            tagStack = [];
        }

        if (inPage) {
            if (tag.name == "text") {
                inText = true;
            } else if (tag.name == "title") {
                inTitle = true;
            } else if (tag.name == "redirect") {
                inPage = false;
                element = null;
                tagStack = [];
                //callback({redirect: true}, this._parser.line);
            } else if (tag.name == "id") {
                inId = true;
            } else if (tag.name == "timestamp") {
                inTimestamp = true;
            }
        }
        tagStack.push(tag.name);
    });
    saxStream.on("text", function (text) {
        if (inPage) {
            if (inText) {
                element.content = text;
            } else if (inTitle) {
                element.title = text;
            } else if (inId && tagStack[tagStack.length-2] == "page") {
                element.id = text;
                element.url = "https://en.wikipedia.org/?curid=" + text;
            } else if (inTimestamp) {
                element.timestamp = text;
            }
        }
    });

    saxStream.on("closetag", function (tagName) {
        if (tagName == "text") {
            inText = false;
        } else if (tagName == "page" && inPage) {
            inPage = false;
            tagStack = [];
            callback(element, this._parser.line);
            element = null;
        } else if (tagName == "title") {
            inTitle = false;
        } else if (tagName == "id") {
            inId = false;
        } else if (tagName == "timestamp") {
            inTimestamp = false;
        }
        tagStack.pop();
    });

    var file = fs.createReadStream(config.dumpLocation);
    /*var stream = new XmlStream(file);
    stream.preserve(elementName);
    stream.on('endElement: ' + elementName, function (element) {
        callback(element);
    });*/


// pipe is supported, and it's readable/writable
// same chunks coming in also go out.
    file.pipe(saxStream);
};

module.exports.extractData = function(element){
    return {title: element.title.$text,
        content: element.revision.text.$text,
        timestamp: element.revision.timestamp.$text,
        id: element.id.$text,
        url: "https://en.wikipedia.org/?curid=" + element.id.$text
    };
};