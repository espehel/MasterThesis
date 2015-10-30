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

//can be used if all the sections of the page is being stored
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
            parent_header: entry.parent,
            header_type: entry.header.type
        };
        //console.log("section: ", sectionDAO);
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
                console.log(entry);
                console.log(err);
            }
        });
    })
};

module.exports.insertCategories = function(categories, pageId) {
    categories.forEach(function(entry){
        connection.query('SELECT `id` FROM `categories` WHERE `name` = ?', [entry], function(err, results, fields){
            if(err){
                console.log(err)
            } else {
                if (results.length > 0) {
                    //console.log("r1: ", results);
                    linkCategoryToPage(results[0].id, pageId);
                } else {
                    connection.query("INSERT INTO `categories` SET ?", {name: entry}, function (err, result) {
                        if(err){
                            console.log(err);
                        } else {
                            //console.log("r2: ", result);
                            linkCategoryToPage(result.insertId, pageId);
                        }
                    })
                }
            }
        })

    })
};

module.exports.disconnect = function(){
    if (connection) {
        connection.end();
    }
};

