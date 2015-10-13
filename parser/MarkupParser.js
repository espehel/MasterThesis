var pageParser = require('wtf_wikipedia');


module.exports.extractSectionHeaders = function (markup) {
    var plaintext = pageParser.plaintext(markup.content);

    var headers = [];

    var start2 = plaintext.indexOf("==");
    var start3 = plaintext.indexOf("===");
    var start4 = plaintext.indexOf("====");
    var start5 = plaintext.indexOf("=====");
    while(start2 != -1) {

        var symb;
        var start;
        if(numbers.areEqual(start2,start3,start4,start5)){
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
    }

    return headers;
}