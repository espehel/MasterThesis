var pageParser = require('wtf_wikipedia');
var numbers = require('../utils/numbers');

//looks for characters that marks headers and classify what level in the hierarchy they belong to
var identifyHeader = function(start, text){
    var index = start;

    while(text.charAt(index) == '='){
        index++;
    }
    var type = index-start;
    if(type <= 1){
        return undefined;
    }
    var end = text.indexOf(repeat("=",type),start+type);
    var header = text.substring(start+type,end).trim();
    return {start: start, end: end+type-1,headerText: header, type: type};
};

//simply generates a string of the same char with n length
var repeat = function(char,n){
    var string = "";
    for(var i = 0; i < n; i++){
        string +=char;
    }
    return string;
};

//checks for the markup the signals the start of a comment
var isComment = function(start, text){
  return text.substr(start,4) == '<!--'
};

//simply checks if the header contains a the word example or the header of a higher section. This function should be expanded for better filtering
var isRelevant = function(section){
    var header = section.header.headerText.toLocaleLowerCase();

    if (section.content.length < 1) {
        return false;
    }
    else if(header.indexOf("example") != -1) {
        return true;
    }
    else if (section.ancestorString.toLocaleLowerCase().indexOf("example") != -1) {
        return true;
    }
    else {
        return false;
    }

};

//finds the parent of the next section to be inserted. Assumes a sequential top to bottom insertion of sections
var findParent = function (sections, type) {
    //a type 2 header has no parent
    if(type == 2) {
        return undefined;
    }

    //by reversing the list we can just search for the first occurence of a header of a smaller type
    sections = sections.reverse();
    for (var i = 0; i < sections.length; i++) {
        var other = sections[i].header.type;
        //a smaller type number means a header higher in the hierarchy
        if(other < type) {
            return sections[i].header.headerText;
        }
    }
};

//creates a string containing the parent sections
var getAncestorString = function (sections, type) {
    //a type 2 header has no parent
    if(type == 2) {
        return "";
    }

    var ancestorString = ""

    //by reversing the list we can just search for the first occurence of a header of a smaller type
    sections = sections.reverse();
    for (var i = 0; i < sections.length; i++) {
        var other = sections[i].header.type;
        //a smaller type number means a header higher in the hierarchy
        if(other < type) {
            if(ancestorString.length != 0){
                ancestorString += ">";
            }
            ancestorString += sections[i].header.headerText;
            type = other;
        }
    }
    return ancestorString;
};

//iterates through each character looking for special characters, when found structures them into objects
module.exports.parseMarkup = function(text) {
    var cursor = 0;
    var parsed = {sections: [], valid: true, intro: "not found"};
    var prevSection;
    var foundIntro = false;

    while(cursor < text.length){

        //searches for commented markup, which it skips without parsing
        if(text.charAt(cursor) == '<'){
            if(isComment(cursor,text)){

                var end = text.indexOf("-->",cursor+4)+3;
                if(end == 2){
                    cursor++;
                } else {
                    cursor = end;
                }
            } else {
                cursor++;
            }
        }
        // searches for section headers
        else if(text.charAt(cursor) == '=') {
            var header = identifyHeader(cursor, text);
            if (header) {

                if(!foundIntro) {
                    parsed.introduction = text.substring(0,cursor);
                    foundIntro = true;
                }

                if (prevSection) {
                    prevSection.end = header.start - 1;
                    prevSection.content = text.substring(prevSection.start, prevSection.end + 1);
                    parsed.sections.push(prevSection);
                }
                var section = {start: header.end + 1, end: -1, header: header, content: undefined, parent: undefined};
                section.ancestorString = getAncestorString(parsed.sections, header.type);
                prevSection = section;


                if (header.headerText.length > 100) {
                    parsed.valid = false;
                }

                if (header.end <= cursor) {
                    cursor++;
                    parsed.valid = false;
                } else {
                    cursor = header.end;
                }


            } else {
                cursor++;
            }
        }
        else {
            cursor++;
        }
    }
    return parsed;
};

//retrieves sections that should be relevan
module.exports.searchTitles = function(page) {
    var sections = page.sections;
    var targetSections = [];

    sections.forEach(function (entry) {
       if(isRelevant(entry)){
           targetSections.push(entry);
       }
    });

    return targetSections;
};

//returns an array of the articles categories
module.exports.getCategories = function(markup) {
    return pageParser.parse(markup).categories;
};

module.exports.addPlaintextContent = function (sections) {
    sections.forEach(function (entry) {
        entry.plaintextContent = pageParser.plaintext(entry.content);
    })
};

//iterates through each character looking for markup signaling links/page-references
function getReferences(text) {
    var cursor = 0;
    var referenceArray = [];
    while(cursor < text.length) {
        //found the start of a reference
        if(text.charAt(cursor) == '[' && text.charAt(cursor+1) == '[' && text.charAt(cursor+2) != '[') {
            //the end of the reference
            var pageReference = {};
            var end = text.indexOf("]]", cursor+1);
            var reference = text.substring(cursor+2,end).split('|');
            reference[0] = reference[0].toLocaleLowerCase();//convert to lowercase since it will then redirect to page with correct caseing and wikipage references doesnt always have correct capitalization
            if(reference.length == 1) { // same name for link and display name
                pageReference.reference_name = reference[0];
                pageReference.page_name = reference[0];
                pageReference.page_link = "https://en.wikipedia.org/wiki/" + reference[0].replace(' ', '_');;
                referenceArray.push(pageReference);
            } else if (reference.length == 2) { // different name for link and display name
                pageReference.reference_name = reference[1];
                pageReference.page_name = reference[0];
                pageReference.page_link = "https://en.wikipedia.org/wiki/" + reference[0].replace(' ', '_');
                referenceArray.push(pageReference);
            } else {//not a link

            }
            if(end < 0) {
                cursor++;
            } else {
                cursor = end + 1;
            }
        } else {
            cursor++;
        }
    }
}

module.exports.getIntroductionReferences = function (section) {
    return getReferences(section);
}

module.exports.getPageReferences = function (sections) {
    var referenceMap = new Map();
    sections.forEach(function (entry) {
        var referenceArray = getReferences(entry.content);
        referenceMap.set(entry.header.headerText, referenceArray);
    });
    return referenceMap;
};
