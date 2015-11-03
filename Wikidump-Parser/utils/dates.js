
module.exports.fromWikiTimestampToSqlTimestamp = function(wikiTime){
    var sqlTime = wikiTime.replace("T", " ");
    sqlTime = sqlTime.substr(0,sqlTime.length-1);
    return sqlTime;
};
