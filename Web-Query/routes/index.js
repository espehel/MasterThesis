var express = require('express');
var router = express.Router();
var es_api = require('../elasticsearch/api');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Example Query' });
});

/* GET examples */
router.get('/examples/', function(req, res, next) {
    es_api.search(req.query.search, function (error, result) {
        res.json({ examples: result });
    })
});

module.exports = router;
