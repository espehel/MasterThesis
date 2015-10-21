var mysql = require('mysql');
var config = require('../config');
var dateUtil = require('../utils/dates');

var connection;

module.exports.connect = function(){

    connection = mysql.createConnection(config.databaseConfig);

    connection.connect();
}

module.exports.insertPage = function(element, callback) {
    if (connection) {
        var pageDAO = {title: element.title, timestamp: dateUtil.fromWikiTimestampToSqlTimestamp(element.timestamp)};
        connection.query('INSERT INTO pages SET ?', pageDAO, function(err, result) {
            if(err){
                console.log(err);
            } else {
                callback(result.insertId);
            }
        });
    }
}

module.exports.insertSections = function(sections, pageId){
    sections.forEach(function(entry){
        var sectionDAO = { header: entry.header.headerText, content: entry.content, page_id: pageId};
        console.log("section: ", sectionDAO);
        connection.query('INSERT INTO page_sections SET ?', sectionDAO, function(err, result) {
            if(err){
                console.log(err);
            }
        });
    })
}

module.exports.disconnect = function(){
    if (connection) {
        connection.end();
    }
}

