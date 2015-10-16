var pageParser = require('wtf_wikipedia');
var numbers = require('../utils/numbers');

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

var repeat = function(char,n){
    var string = "";
    for(var i = 0; i < n; i++){
        string +=char;
    }
    return string;
};

var isComment = function(start, text){
  return text.substr(start,4) == '<!--'
};

module.exports.extractSectionHeaders = function (markup) {
    //var plaintext = pageParser.plaintext(markup.content);
    var plaintext = markup.content;
    var headers = [];
    console.log(markup.content);

    var start2 = plaintext.indexOf("==");
    var start3 = plaintext.indexOf("===");
    var start4 = plaintext.indexOf("====");
    var start5 = plaintext.indexOf("=====");
    var toMuch = plaintext.indexOf("======")
    while(start2 != -1) {
        //console.log(start2);

        var symb;
        var start;

        if(numbers.areEqual(start2,start3,start4,start5,toMuch)) {
            start2 = start2 + 6;
            continue;
        }else if(numbers.areEqual(start2,start3,start4,start5)){
            symb = "=====";
            start = start5;
        } else if(numbers.areEqual(start2,start3,start4)){
            symb = "====";
            start = start4;
        } else if(start2==start3){
            symb = "===";
            start = start3;
        } else {
            symb = "==";
            start = start2;
        }
        var end = plaintext.indexOf(symb, start + 1);
        //console.log(plaintext.substring(start + symb.length, end));
        headers.push(plaintext.substring(start + symb.length, end).trim());


        start2 = plaintext.indexOf("==",end+symb.length);
        start3 = plaintext.indexOf("===",end+symb.length);
        start4 = plaintext.indexOf("====",end+symb.length);
        start5 = plaintext.indexOf("=====",end+symb.length);
        toMuch = plaintext.indexOf("======",end+symb.length);
    }

    return headers;
}

module.exports.parseMarkup = function(markup) {
    var cursor = 0;
    var text = markup.content;
    var parsed = {sections: [], valid: true};
    var prevSection;

    while(cursor < text.length){

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
        else if(text.charAt(cursor) == '=') {
            var header = identifyHeader(cursor, text);
            if (header) {
                if (prevSection) {
                    prevSection.end = header.start - 1;
                    prevSection.content = text.substring(prevSection.start, prevSection.end + 1);
                    parsed.sections.push(prevSection); //TODO gir forgje eksempel
                }
                var section = {start: header.end + 1, end: -1, header: header, content: undefined};
                prevSection = section;

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
    //parsed.sections.push(prevSection);
    return parsed;
}











