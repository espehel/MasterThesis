var XMLParser = require('./parser/XMLParser');
var markupParser = require('./parser/MarkupParser');
var db = require('./database/MySQLApi');
var pageParser = require('wtf_wikipedia');

db.connect();

var i = 0;
var time = Date.now();

XMLParser.getElements("page",function(element){
    //console.log("a: ", element);
    var markup = XMLParser.extractData(element);

    if(!element.hasOwnProperty('redirect')){
        //console.log("b: ", parsed);
        //db.insertPage(parsed);
        //console.log("!");
        /*var parsed = pageParser.parse(markup.content);
        console.log(parsed.text);
        parsed.text.Intro.forEach(function (entry) {
            console.log(entry.text);
        })*/

        //console.log(markup.title);
        //var parsedPage = markupParser.extractSectionHeaders(markup);

        var parsedPage = markupParser.parseMarkup(markup);
        parsedPage.sections.forEach(function(entry){
            if(entry.header.headerText.toLocaleLowerCase() == "example"){
                console.log(markup.title.toLocaleUpperCase());
                console.log(entry);
            }
        })
    }
});