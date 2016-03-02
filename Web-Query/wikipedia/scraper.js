var request = require("request");
var cheerio = require("cheerio");
var pageParser = require('wtf_wikipedia');


//creates a string of the h-tag in the parameter and all the bigger h-tags
function createTagSelector(tag) {
    if(tag.charAt(0) != "h" || tag.length != 2) {
        return tag;
    }

    var type = tag.charAt(1);
    var selectorString = tag;

    for(var i = type-1; i > 0; i--) {
        selectorString += ", h" + i;
    }
    return selectorString;
}

function removeMarkup(string) {
    var first = string.indexOf("''");
    var last = string.indexOf("''", first+1);
    if( first != -1 && last != -1) {
        var shortened = string.substring(0, first) + string.substring(last+2, string.length);
        shortened = removeMarkup(shortened);
    } else {
        return string;
    }
    return shortened;
}

function cleanString(string) {

    return pageParser.plaintext(removeMarkup(string))
        .replace(new RegExp(" ", 'g'), "_")
        .replace(new RegExp(",", 'g'), ".2C")
        .replace(new RegExp("\"", 'g'), ".22")
        .replace(new RegExp("\\(", 'g'), ".28")
        .replace(new RegExp("\\)", 'g'), ".29");
}

module.exports.scrape = function (url, title, section, callback) {
    request(url, function (error, response, body) {
        if (!error) {
            var $ = cheerio.load(body);

            var cleanedSection = cleanString(section);
            console.log("-----------------------------------");
            console.log(url + "  :   " + section);
            console.log(cleanedSection);
            //var parent = $('#' + cleanedSection).parent();
            var span = $('[id*="' + cleanedSection + '"]');
            span.html(title + ": " + span.html());
            console.log(span.html());
            var parent = span.parent();
            if(parent.length > 0) {
                var tag = $(parent)[0].name;
                //want to select the next h tag wich is of same size or bigger
                var tagSelector = createTagSelector(tag);
                var sectionArray = parent.nextUntil(tagSelector);
                //console.log($.html(parent[0]));
                var htmlString = $.html(parent[0]) + "\n";
                sectionArray.each(function (index, element) {
                    htmlString += $.html(element);
                    htmlString += "\n";
                });
                //console.log(htmlString);
                callback(null, htmlString);
            } else {
                console.log("Error in finding section");
                callback({error: "error"}, null);
            }
        } else {
            console.log("We’ve encountered an error: " + error);
            callback(error, null);
        }
    });
};

//console.log(cleanString("Post logics ''P<sub>m</sub>''"));
//console.log(removeMarkup("Post logics ''P<sub>m</sub>''"));

//console.log(pageParser.plaintext("Post logics ''P<sub>m</sub>''"));

/*module.exports.scrape("https://en.wikipedia.org/?curid=38024", "Belnap logic", function (error, callback) {

});*/