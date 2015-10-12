var parser = require('./parser/XMLParser');
var db = require('./database/MySQLApi');

db.connect();

parser.getElements("page",function(element){
    //console.log("a: ", element);
    var parsed = parser.extractData(element);

    if(element.hasOwnProperty('redirect')){
        //console.log("b: ", parsed);
        db.insertPage(parsed);
    }
});