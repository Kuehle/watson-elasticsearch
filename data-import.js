const axios = require('axios')

// check out http://www.themealdb.com/api.php for information about the api
    

const config = {
    apiUrl: 'http://www.themealdb.com/api/json/v1/',
    apiKey: process.env.KEY || '1',
    url: () => this.apiUrl + this.apiKey
}

// returns promise with all Categories in data property
function loadCategories() {
    return axios.get(`${config.url()}/list.php?c=list`)
}

// returns promise with all Meals from Category in data property
function loadMealsFromCategory(category) {
    return axios.get(`${config.url()}/filter.php?c=${category}`)
}

async function loadData() {
    let categories = await loadCategories
    categories.data.forEach(async category => {
        console.log(category)
    })
}

loadData()