var XMLParser = require('./parser/XMLParser');
var markupParser = require('./parser/MarkupParser');
var db = require('./database/MySQLApi');
var pageParser = require('wtf_wikipedia');
var numbers = require('./utils/numbers');

db.connect();

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

        var headers = markupParser.extractSectionHeaders(markup);
        if(headers.indexOf("Example") != -1){
         console.log(markup.title);
         }


       // var plaintext = txtwiki.parseWikitext(markup);
        //console.log(plaintext);
    }
});