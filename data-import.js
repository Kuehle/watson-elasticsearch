const axios = require('axios')

// check out http://www.themealdb.com/api.php for information about the api
    
let db = {}

let config = {
    apiUrl: 'http://www.themealdb.com/api/json/v1/',
    apiKey: process.env.KEY || '1',
    url: () => `${config.apiUrl}${config.apiKey}`,
    elasticUrl: 'http:localhost:'
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

async function loadData() {
    let catRes = await loadCategories()
    let categories = catRes.data.meals.map(cat => cat.strCategory)

    categories.forEach(cat => loadMealsFromCategory(cat).then(res => console.log('res.data', res.data.meals)))
}