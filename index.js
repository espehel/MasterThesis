var XMLParser = require('./parser/XMLParser');
var markupParser = require('./parser/MarkupParser');
var db = require('./database/MySQLApi');
var pageParser = require('wtf_wikipedia');

//db.connect();

XMLParser.getElements("page", function(element){
    //console.log(element);
    var markup = XMLParser.extractData(element);
    console.log("m: ", element);

    if(!element.hasOwnProperty('redirect')){

        var parsedPage = markupParser.parseMarkup(markup);
        console.log("p: ", pageParser.parse(markup.content));
        //return;
        if(parsedPage.valid) {
            var exampleSections = markupParser.searchTitles(parsedPage);

            if (exampleSections.length > 0) {
                markupParser.addPlaintextContent(exampleSections);
                console.log("page: ", pageParser.plaintext(exampleSections[0].content));
                //return;
                db.insertPage(markup, function (pageId) {
                    db.insertSections(exampleSections, pageId);
                    var categories = markupParser.getCategories(markup.content);
                    db.insertCategories(categories,pageId);
                });

            }
        }

    }
});