var mysql = require('mysql');
var config = require('../config');
var dateUtil = require('../utils/dates');

var connection;

module.exports.connect = function(){

    connection = mysql.createConnection(config.databaseConfig);

    connection.connect();
};

var linkCategoryToPage = function(categoryId, pageId) {
    connection.query('INSERT INTO `pages_categories` SET ?', {page_id: pageId, category_id: categoryId}, function (err, result) {
        if(err) {
            console.log(err);
        }
    })
};

module.exports.insertPage = function(element, callback) {
    if (connection) {
        var pageDAO = {title: element.title,
            timestamp: dateUtil.fromWikiTimestampToSqlTimestamp(element.timestamp),
            wiki_id: element.id,
            url: element.url
        };
        connection.query('INSERT INTO pages SET ?', pageDAO, function(err, result) {
            if(err){
                console.log(err);
            } else {
                callback(result.insertId);
            }
        });
    }
};

module.exports.insertSections = function(sections, pageId) {
    sections.forEach(function(entry){
        var sectionDAO = { header: entry.header.headerText,
            content_markup: entry.content,
            content_plaintext: entry.plaintextContent,
            page_id: pageId,
            length: entry.content.length
        };
        console.log("section: ", sectionDAO);
        connection.query('INSERT INTO page_sections SET ?', sectionDAO, function(err, result) {
            if(err){
                console.log(err);
            }
        });
    })
};

module.exports.insertCategories = function(categories, pageId) {
    categories.forEach(function(entry){
        connection.query('SELECT `id` FROM `categories` WHERE `name` = ?', [entry], function(error, results, fields){
            if (results.length > 0) {
                linkCategoryToPage(results[0],pageId);
            } else {
                connection.query("INSERT INTO `categories` SET ?", {name: entry}, function (err, result) {
                    linkCategoryToPage(result.insertId, pageId);
                })
            }
        })

    })
};

module.exports.disconnect = function(){
    if (connection) {
        connection.end();
    }
};

