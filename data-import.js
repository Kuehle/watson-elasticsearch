const axios = require('axios')

// check out http://www.themealdb.com/api.php for information about the api
    
let db = {}

let config = {
    apiUrl: 'http://www.themealdb.com/api/json/v1/',
    apiKey: process.env.KEY || '1',
    url: () => `${config.apiUrl}${config.apiKey}`,
    elasticUrl: 'http://localhost:9200/meals/'
}

// returns promise with all Categories in data property
function loadCategories() {
    return axios.get(`${config.url()}/list.php?c=list`)
}

// returns promise with all Meals from Category in data property
function loadMealsFromCategory(category) {
    return axios.get(`${config.url()}/filter.php?c=${category}`)
}

function transformMeal(meal) {
    let ingredients = []
    let ingredientNameKeys = Object.keys(meal).filter(key => key.match(/ingredient/i))
    let ingredientMeasureKeys = Object.keys(meal).filter(key => key.match(/measure/i))
    
    ingredientNameKeys.forEach((key, index) => ingredients.push({name: meal[key], measure: meal[ingredientMeasureKeys[index]]}))

    return {
        id: meal.idMeal,
        name: meal.strMeal, 
        category: meal.strCategory, 
        area: meal.strArea, 
        instructions: meal.strInstructions, 
        ingredients: ingredients.filter(ingredient => ingredient.name), 
        imgUrl: meal.strMealThumb,
        videoUrl: undefined 
    }
}

function loadMealFromId(id) {
    return axios.get(`${config.url()}/lookup.php?i=${id}`)
}

function loadIds() {
    return new Promise((resolve, reject) => {
        let promisArr = []
        loadCategories().then(categories => {
            var ids = []
            categories.data.meals.map(cat => cat.strCategory)
                .forEach(categoryName => {
                    promisArr.push(loadMealsFromCategory(categoryName))
                })
            Promise.all(promisArr).then(all => {
                all.forEach(categoryPromise => categoryPromise.data.meals.forEach(meal => ids.push(meal.idMeal)))
                resolve(ids)
            })
        })
    })
}

// loadIds().then(ids => console.log(ids))

// returns promise for elastic api answer
function sendToElastic(meal) {
    return axios.put(`${config.elasticUrl}${meal.category}/${meal.id}`, meal)
}

loadMealFromId('52772').then(data => console.log("recipe", sendToElastic(transformMeal(data.data.meals[0])).then((data, err) => console.log(data, err))))

function execute() {
    var promiseArr = []

}