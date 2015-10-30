var XMLParser = require('./parser/XMLParser');
var markupParser = require('./parser/MarkupParser');
var db = require('./database/MySQLApi');
var pageParser = require('wtf_wikipedia');

db.connect();

XMLParser.getElements("page", function(element){
    //console.log(element);
    var markup = XMLParser.extractData(element);
    //console.log("m: ", element);

    if(!element.hasOwnProperty('redirect')){

        var parsedPage = markupParser.parseMarkup(markup);
        markup.introduction = parsedPage.introduction;
        //console.log("p: ", pageParser.parse(markup.content));
        //return;
        if(parsedPage.valid) {
            var exampleSections = markupParser.searchTitles(parsedPage);

            if (exampleSections.length > 0) {
                markupParser.addPlaintextContent(exampleSections);
                var referencesMap = markupParser.getPageReferences(exampleSections);
                //console.log("page: ", pageParser.plaintext(exampleSections[0].content));
                //return;
                //console.log("m: ", markup);
                //console.log("e: ", exampleSections);
                db.insertPage(markup, function (pageId) {
                    db.insertSections(exampleSections, pageId, function (sectionId, sectionHeader) {
                        db.insertPageReferences(referencesMap.get(sectionHeader), sectionId);
                    });
                    var categories = markupParser.getCategories(markup.content);
                    //console.log("c: ", categories);
                    db.insertCategories(categories,pageId);
                });

            }
        }

    }
});