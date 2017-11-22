const elasticsearch = require('elasticsearch')
const client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
})


function search(searchObj) {
    return new Promise((resolve, reject) => {
        client.search(searchObj).then((body) => {
            resolve(body.hits.hits)
        }, (err) => {
            console.trace(error.message)
            reject(err)
        })
    })
}

// sample query for category search
// https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/api-reference.html#api-search
// extended body searches https://www.elastic.co/guide/en/elasticsearch/reference/6.0/search-request-body.html 
search({"q" : "category:beef", "size": "2", "sort": "name:-1,area:1"}).then(results => console.log("Category Beef:", results))