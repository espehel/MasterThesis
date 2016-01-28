var express = require('express');
var router = express.Router();
var es_api = require('../elasticsearch/api');
var wikipedia = require("../wikipedia/wikipedia-js");

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Example Query' });
});

/* GET examples */
router.get('/examples/', function(req, res, next) {
    es_api.search(req.query.search, function (error, result) {
        var length = result.length;
        var i = 0;
        result.forEach(function(entry) {
            wikipedia.convertSection(entry._source.markup, function(err, html){
                console.log(entry);
                entry._source.html = html;
                i++;

                if(i === length) {
                    console.log("FINISHED");
                    res.json({ examples: result });
                }
            });
        });
    })
});

/* GET example/id */
router.get('/examples/:id', function(req, res, next) {

});

module.exports = router;