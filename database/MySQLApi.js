var mysql = require('mysql');
var config = require('../config');
var dateUtil = require('../utils/dates');

//connect to the mysql db
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

module.exports.disconnect = function(){
    if (connection) {
        connection.end();
    }
};

module.exports.insertPage = function(element, callback) {
    if (connection) {
        var pageDAO = {title: element.title,
            timestamp: dateUtil.fromWikiTimestampToSqlTimestamp(element.timestamp),
            wiki_id: element.id,
            url: element.url,
            introduction: element.introduction
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

//can be used if all the sections of the page is being stored. This method is not tested properly
var insertSectionRecursive = function (sections, pageId, i, nameToIdMap) {
    if(i >= sections.length) {
        return;
    }

    var sectionDAO = { header: sections[i].header.headerText,
        content_markup: sections[i].content,
        content_plaintext: sections[i].plaintextContent,
        page_id: pageId,
        length: sections[i].content.length
    };
    var parentId = nameToIdMap.get(sectionDAO.parent)
    if(parentId) {
        sectionDAO.parent_section_id = parentId;
    } else {
        sectionDAO.parent_section_id = null;
    }

    connection.query('INSERT INTO page_sections SET ?', sectionDAO, function(err, result) {
        if(err){
            console.log(err);
        } else {
            nameToIdMap.set(sectionDAO.header, result.insertId);
            insertSectionRecursive(sections,pageId,++i,nameToIdMap);
        }
    });
}

module.exports.insertSections = function(sections, pageId, callback) {
    sections.forEach(function(entry){
        var sectionDAO = { header: entry.header.headerText,
            content_markup: entry.content,
            content_plaintext: entry.plaintextContent,
            page_id: pageId,
            length: entry.content.length,
            ancestors: entry.ancestorString,
            header_type: entry.header.type
        };
        connection.query('INSERT INTO page_sections SET ?', sectionDAO, function(err, result) {
            if(err){
                console.log(err);
            } else {
                callback(result.insertId, sectionDAO.header);
            }
        });
    })
};

module.exports.insertPageReferences = function (references, sectionId) {
    references.forEach(function(entry){
        entry.section_id = sectionId;
        connection.query('INSERT INTO page_references SET ?', entry, function(err, result) {
            if(err){
                console.log(err);
            }
        });
    })
};

module.exports.insertCategories = function(categories, pageId) {
    categories.forEach(function(entry){
        //check if the category already exists in the table
        connection.query('SELECT `id` FROM `categories` WHERE `name` = ?', [entry], function(err, results, fields){
            if(err){
                console.log(err)
            } else {
                //if the category exists already
                if (results.length > 0) {
                    linkCategoryToPage(results[0].id, pageId);
                //if it does not exist we insert it
                } else {
                    connection.query("INSERT INTO `categories` SET ?", {name: entry}, function (err, result) {
                        if(err){
                            console.log(err);
                        } else {
                            linkCategoryToPage(result.insertId, pageId);
                        }
                    })
                }
            }
        })

    })
};
