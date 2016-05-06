var express = require('express');
var router = express.Router();
var es_api = require('../elasticsearch/api');
var wikipedia = require("../wikipedia/wikipedia-js");
var scraper = require("../wikipedia/scraper");
var analyzer = require("../analyzing/example-analyzer");

//should keep info about last search performed. This solution only works when using app locally
var results = [];
var categoryGroup;

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

            //add results to an array that can be used in exploring an example further
            results.push({
                id: entry._source.id,
                score: entry._score,
                categories: entry._source.categories
            });
            
            analyzer.checkRelevance(entry, req.query.search);

            //scrapes the live wiki page for the html and style
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

/* POST examples/id */
/*router.post('/examples/:id', function(req, res, next) {
    console.log("redirect");
    res.redirect('/examples/'+req.params.id);
});*/

/* GET examples/id */
router.get('/examples1/:id', function(req, res, next) {
    es_api.getExampleById(req.params.id, function (error, example) {
        if (example) {
            es_api.getExamplesByCategoryFiltering(example, function (error2, similarExamples) {
                similarExamples.forEach(function (entry) {
                    //console.log(entry._source.title);
                });
                scraper.scrape(example._source.url, example._source.title, example._source.header, function (err, html) {
                    if (err) {
                        example._source.html = "";
                    } else {
                        example._source.html = html;
                    }
                    res.render('example', {example: example});
                    example.similarExamples = {};
                    example.similarExamples.left = analyzer.getReferredFrom(example, similarExamples);
                    console.log(example.similarExamples.left);
                    example.similarExamples.right = analyzer.getRefersTo(example, similarExamples);
                    console.log(example.similarExamples.right);
                })
            })
        }
    })
});

/* GET examples/id */
router.get('/examples/:id', function(req, res, next) {
    es_api.getExampleById(req.params.id, function (error, example) {
        if (example) {
            var category;
            if(req.query.state == '1' && results.length > 0) {
                category = analyzer.pickBestCategory(results, example._source.categories);
                categoryGroup = category;
            }else if (req.query.state == 2 && categoryGroup) {
                category = categoryGroup;
            } else {
                category = example._source.categories[0];
            }
            console.log(category);
            es_api.getExamplesInCategory(category, function (error2, similarExamples) {
                scraper.scrape(example._source.url, example._source.title, example._source.header, function (err, html) {
                    if (err) {
                        example._source.html = "";
                    } else {
                        example._source.html = html;
                    }
                    example.similarExamples = analyzer.order(similarExamples, example);
                    //example.similarExamples = analyzer.splitInTwo(similarExamples);
                    res.render('example', {example: example});
                })
            })
        }
    })
});

/* GET examples/id */
router.get('/examples2/:id', function(req, res, next) {
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
