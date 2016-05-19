#Example Indexer

## Setting up Elasticsearch
* Download and follow installing instructions from [https://www.elastic.co/products/elasticsearch]()
* Alter the following fields in `config/elasticsearch.yml`
    * `cluster.name: wiki_cluster`
    * `node.name: node_01`
    * `network.host: 127.0.0.1`
* run elasticsearch with the command: `./bin/elasticsearch`
* create mappings for the index with the following command in the terminal:  
    ```
    curl -XPUT 'http://localhost:9200/wikipedia/' -d '{
         "mappings": {
             "example": {
               "properties": {
                 "categories": {
                   "type": "string",
                   "index": "not_analyzed"
                 },
                 "content": {
                   "type": "string"
                 },
                 "header": {
                   "type": "string"
                 },
                 "id": {
                   "type": "long"
                 },
                 "introduction": {
                   "type": "string"
                 },
                 "markup": {
                   "type": "string"
                 },
                 "pageId": {
                   "type": "long"
                 },
                 "title": {
                   "type": "string"
                 },
                 "url": {
                   "type": "string"
                 }
               }
             }
           }
       }'
       ```
       
##Indexing
* run the main file from `src/main/java/Main.java`
