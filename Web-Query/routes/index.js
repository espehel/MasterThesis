var express = require('express');
var router = express.Router();
var es_api = require('../elasticsearch/api');
var wikipedia = require("../wikipedia/wikipedia-js");
var scraper = require("../wikipedia/scraper");
var analyzer = require("../analyzing/example-analyzer");

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
            scraper.scrape(entry._source.url, entry._source.title, entry._source.header, function(err, html){
                if(err) {
                    entry._source.html = "";
                } else {
                    entry._source.html = html;
                }
                i++;

                if(i === length) {
                    res.json({ examples: result });
                }
            });


        });
    })
});

/* GET examples/id */
router.get('/examples2/:id', function(req, res, next) {
    es_api.getExampleById(req.params.id, function (error, example) {
        if (example) {
            es_api.getExamplesByCategoryFiltering(example, function (error2, similarExamples) {
                similarExamples.forEach(function (entry) {
                    console.log(entry._source.title);
                });
                scraper.scrape(example._source.url, example._source.title, example._source.header, function (err, html) {
                    if (err) {
                        example._source.html = "";
                    } else {
                        example._source.html = html;
                    }
                    example.similarExamples = {};
                    example.similarExamples.left = analyzer.getReferredFrom(example, similarExamples);
                    console.log(example.similarExamples.left);
                    example.similarExamples.right = analyzer.getRefersTo(example, similarExamples);
                    console.log(example.similarExamples.right);
                    res.render('example', {example: example});
                })
            })
        }
    })
});

/* GET examples/id */
router.get('/examples/:id', function(req, res, next) {
    es_api.getExampleById(req.params.id, function (error, example) {
        if (example) {
            es_api.getRefersTo(example, function (error2, refersTo) {
                es_api.getReferredFrom(example, function (error3, referredFrom) {
                    scraper.scrape(example._source.url, example._source.title, example._source.header, function (err, html) {
                        if (err) {
                            example._source.html = "";
                        } else {
                            example._source.html = html;
                        }
                        example.similarExamples = {};
                        example.similarExamples.left = referredFrom;
                        example.similarExamples.right = refersTo;
                        res.render('example', {example: example});
                    })
                })
            })
        }
    })
});

module.exports = router;
