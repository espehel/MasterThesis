var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: 'localhost:9200'
    //,log: 'trace'
});

module.exports.getExampleById = function (exampleId, callback) {
    client.search({
        index: "wikipedia",
        body: {
            size: 1,
            query: {
                filtered: {
                    filter: {
                        term: {
                            id: exampleId
                        }
                    }
                }
            }
        }
    }, function (error, response) {
        callback(error, response.hits.hits[0]);
    });
};

module.exports.getReferredFrom = function (example, callback) {
    client.search({
        index: "wikipedia",
        body: {
            size: 10,
            query: {
                filtered: {
                    query: {
                        match: {
                            references: example._source.title

                        }
                    },
                    filter: {
                        bool: {
                            must: {
                                terms: {
                                    categories: example._source.categories
                                }
                            },
                            must_not: {
                                term: {
                                    id: example._source.id
                                }
                            }
                        }
                    }
                }
            }
        }
    }, function (error, response) {
        callback(error, response.hits.hits);
    });
};

module.exports.getRefersTo = function (example, callback) {
    client.search({
        index: "wikipedia",
        body: {
            size: 10,
            query: {
                filtered: {
                    query: {
                        match: {
                            title: example._source.references.join(" ")

                        }
                    },
                    filter: {
                        bool: {
                            filter: {
                                terms: {
                                    categories: example._source.categories
                                }
                            },
                            must_not: {
                                term: {
                                    id: example._source.id
                                }
                            }
                        }
                    }
                }
            }
        }
    }, function (error, response) {
        callback(error, response.hits.hits);
    });
};

module.exports.getExamplesByCategoryFiltering = function (example, callback) { //TODO: can use not match with id to exclude same, can use match with url to get from same page
    client.search({
        index: "wikipedia",
        body: {
            size: 500,
            query: {
                filtered: {
                    filter: {
                        terms: {
                            categories: example._source.categories
                        }
                    }
                }
            }
        }
    }, function (error, response) {
        callback(error, response.hits.hits);
    })
};

module.exports.getExamplesInCategory = function (category, callback) {
    client.search({
        index: "wikipedia",
        body: {
            size: 500,
            query: {
                match: {
                    categories: category
                }
            }
        }
    }, function (error, response) {
        callback(error, response.hits.hits);
    })
};

module.exports.getExamplesBySimilarity = function (example, callback) { //TODO: can use not match with id to exclude same, can use match with url to get from same page
    client.search({
        index: "wikipedia",
        body: {
            size: 10,
            query: {
                match: {
                    categories: example._source.categories.join(", ")
                }
            }
        }
    }, function (error, response) {
        callback(error, response.hits.hits);
    })
};

module.exports.search = function (query_content, callback) {

    client.search({
        index: "wikipedia",
        body: {
            "size": 20,
            query: {
                match: {
                    "_all": query_content

                }
            }
        }
    }, function (error, response) {
        //console.log(response);
        console.log('"', query_content, '" - ', response.hits.total);
        callback(error, response.hits.hits);
    });

};

module.exports.search2 = function (query_content, callback) {

    client.search({
        index: "wikipedia",
        body: {
            "size": 20,
            "query": {
                "match": {
                    "_all": {
                        "query": query_content,
                        "minimum_should_match": "75%"
                    }
                }
            }
        }
    }, function (error, response) {
        //console.log(response);
        callback(error, response.hits.hits);
    });

};

module.exports.search3 = function (query_content, callback) {

    client.search({
        index: "wikipedia",
        body: {
            "size": 20,
            "query": {
                "bool": {
                    "should": [
                        {
                            "match": {
                                "title": {
                                    "query": query_content,
                                    "boost": 3
                                }
                            }
                        },
                        {
                            "match": {
                                "categories": {
                                    "query": query_content,
                                    "boost": 2
                                }
                            }
                        },
                        {
                            "match": {
                                "markup": {
                                    "query": query_content,
                                    "boost": 1
                                }
                            }
                        }, {
                            "match": {
                                "introduction": {
                                    "query": query_content,
                                    "boost": 0.5
                                }
                            }
                        }
                    ]
                }
            }
        }
    }, function (error, response) {
        //console.log(response);
        callback(error, response.hits.hits);
    });

};

module.exports.search4 = function (query_content, callback) {

    client.search({
        index: "wikipedia",
        body: {
            "size": 20,
            "query": {
                "dis_max": {
                    "should": [
                        {
                            "match": {
                                "title": {
                                    "query": query_content,
                                    "boost": 3
                                }
                            }
                        },
                        {
                            "match": {
                                "categories": {
                                    "query": query_content,
                                    "boost": 2
                                }
                            }
                        },
                        {
                            "match": {
                                "markup": {
                                    "query": query_content,
                                    "boost": 1
                                }
                            }
                        }, {
                            "match": {
                                "introduction": {
                                    "query": query_content,
                                    "boost": 0.5
                                }
                            }
                        }
                    ]
                }
            }
        }
    }, function (error, response) {
        //console.log(response);
        callback(error, response.hits.hits);
    });

};

module.exports.search5 = function (query_content, callback) {

    client.search({
        index: "wikipedia",
        body: {
            "size": 20,
            "query": {
                "dis_max": {
                    "should": [
                        {
                            "match": {
                                "title": {
                                    "query": query_content,
                                    "boost": 3
                                }
                            }
                        },
                        {
                            "match": {
                                "categories": {
                                    "query": query_content,
                                    "boost": 2
                                }
                            }
                        },
                        {
                            "match": {
                                "markup": {
                                    "query": query_content,
                                    "boost": 1
                                }
                            }
                        }, {
                            "match": {
                                "introduction": {
                                    "query": query_content,
                                    "boost": 2
                                }
                            }
                        }
                    ],
                    "tie_breaker": 0.3
                }
            }
        }
    }, function (error, response) {
        //console.log(response);
        callback(error, response.hits.hits);
    });

};


