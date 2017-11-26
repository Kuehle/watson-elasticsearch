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

// search({"q" : "category:beef", "size": "2", "sort": "name:-1,area:1"}).then(results => console.log("Category Beef:", results))

console.log("________________________________")
// more complicated with DSL - Domainspecific Language
// https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-bool-query.html
// search({body: {
//         "query": {
//             "bool": {
//                 "must": {
//                     "match": {"name": "Chicken"}
//                 },
//                 "must_not": {
//                     "match": {"area": ["Japanese", "Mexican"]}
//                 }
//             }
//         }
//     }}
// ).then(data => console.log("DSL Query for chicken in body", data))

// {
//     "query": { 
//       "bool": { 
//         "must": [
//           { "match": { "title":   "Search"        }}, 
//           { "match": { "content": "Elasticsearch" }}  
//         ],
//         "filter": [ 
//           { "term":  { "status": "published" }}, 
//           { "range": { "publish_date": { "gte": "2015-01-01" }}} 
//         ]
//       }
//     }
//   }

// Fulltext query -> https://www.elastic.co/guide/en/elasticsearch/reference/current/full-text-queries.html

// search({
//     "body": {
//         "aggs" : {
//             "categorys" : {
//                 "terms" : { "field" : "category" }
//             }
//         }
//     }
// }).then(data => console.log(data))

// search({
//     "body": { 
//         "_source": ["name", "category", "area"],
//         "from": 0,
//         "size": 2,
//         "query": {
//             "match": {
//                 "category": "Beef"
//             }
//         }
//     }
// }).then(data => console.log(data))

// nested fields are matched with e.g. ingredients.name

search({
    "body": { 
        "_source": ["name", "category", "area"],
        "query": {
            "match": {
                "ingredients.name": "garlic"
            }
        },
        "aggs":{
            "dedup" : {
              "terms":{
                "field": "category"
               },
               "aggs":{
                 "dedup_docs":{
                   "top_hits":{
                     "size":1
                   }
                 }
               }    
            }
          }
    }
}).then(data => console.log(data))