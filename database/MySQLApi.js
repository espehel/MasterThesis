var mysql = require('mysql');
var config = require('../config');

var connection;

module.exports.connect = function(){

    connection = mysql.createConnection(config.databaseConfig);

    connection.connect();
}

module.exports.insertPage = function(element) {
    if (connection) {
        var query = connection.query('INSERT INTO pages SET ?', element, function(err, result) {
        });
        //console.log(query.sql);
    }
}

module.exports.disconnect = function(){
    if (connection) {
        connection.end();
    }
}

