const elasticsearch = require('elasticsearch')
const client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
})

client.search({
    q: 'chicken'
}).then((body) => {
    console.log("body", body.hits.hits)
}, (err) => console.trace(error.message))