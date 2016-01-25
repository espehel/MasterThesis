var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    host: 'localhost:9200'
    //,log: 'trace'
});


module.exports.search = function(query_content, callback) {

    client.search({
        index: "wikipedia",
        body : {
            query: {
                match: {
                    content: query_content
                }
            }
        }
    }, function (error, response) {
        //console.log(response);
        callback(error,response.hits.hits);
    });

};