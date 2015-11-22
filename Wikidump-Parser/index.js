var XMLParser = require('./parser/XMLParser');
var markupParser = require('./parser/MarkupParser');
var db = require('./database/MySQLApi');
var config = require('./config');
var Intl = require('intl');

var skipElementCount = config.pageCount;
var n = 0;
var last = -1;
var numberFormat = new Intl.NumberFormat();

db.connect();

//converts every page element into a json-object
XMLParser.getElements("page", function(element, line){

    //console.log(element);

    if (n >= skipElementCount) {
        //extracts the interesting data
        //var markup = XMLParser.extractData(element);
        var markup = element;

        //we ignore pages that exist only as a redirect
        //if (!element.hasOwnProperty('redirect')) {
        //if (!element.redirect) {

            if (markup.content) {
                //parses the content of the page into a object structure
                var parsedPage = markupParser.parseMarkup(markup.content);
                markup.introduction = parsedPage.introduction;

                //some markups contain sequence of signs that the parser cant handle, this is a bad quickfix
                if (parsedPage.valid) {
                    //Finds all sections containing "example" in the header
                    var exampleSections = markupParser.searchTitles(parsedPage);

                    //if a page has these sections
                    if (exampleSections.length > 0) {

                        markupParser.addPlaintextContent(exampleSections);
                        var referencesMap = markupParser.getPageReferences(exampleSections);
                        //inserts data into db using callbacks and the genereated id from the dbms
                        db.insertPage(markup, function (pageId) {
                            db.insertSections(exampleSections, pageId, function (sectionId, sectionHeader) {
                                db.insertPageReferences(referencesMap.get(sectionHeader), sectionId);
                            });
                            var categories = markupParser.getCategories(markup.content);
                            db.insertCategories(categories, pageId);
                        });

                    }
                }
            }
        }
    //}

    n++;
    var completed = Number((line/844482154)*100).toFixed(2);
    if (completed > last) {
        console.log("docs: ", n, "completed: ",completed, "Line: ", numberFormat.format(line));
        var mem = process.memoryUsage();
        console.log("rss: ", numberFormat.format(mem.rss), " heapTotal: ", numberFormat.format(mem.heapTotal), " heapUsed: ", numberFormat.format(mem.heapUsed));
    }
    last = completed;

});
