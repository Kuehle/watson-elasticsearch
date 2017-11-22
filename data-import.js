const axios = require('axios')

// check out http://www.themealdb.com/api.php for information about the api
    
let db = {}

let config = {
    apiUrl: 'http://www.themealdb.com/api/json/v1/',
    apiKey: process.env.KEY || '1',
    url: () => `${config.apiUrl}${config.apiKey}`,
    elasticUrl: 'http://localhost:9200/bot/meals/'
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
        mealId: meal.idMeal,
        name: meal.strMeal, 
        category: meal.strCategory, 
        area: meal.strArea, 
        instructions: meal.strInstructions.split('\r\n').join(' '), 
        ingredients: ingredients.filter(ingredient => ingredient.name), 
        imgUrl: meal.strMealThumb,
        videoUrl: meal.strYoutube,
        srcUrl: meal.strSource
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

// returns promise for elastic api answer
function sendToElastic(meal) {
    return axios.put(`${config.elasticUrl}${meal.mealId}`, meal)
}

function execute() {    
    loadIds().then(ids => {
        var promiseArr = ids.map(id => loadMealFromId(id))
        Promise.all(promiseArr).then(data => {
            console.log(promiseArr)    
            // console.log("data 0", data[0].data.meals[0])
            data.forEach(val => {
                console.log(transformMeal(val.data.meals[0]))
                sendToElastic(transformMeal(val.data.meals[0]))
                    .then(d => console.log('ok'))
                    .catch(e => console.log(e))
            })
        }).catch(e => console.log('Promise all error:', e))
    })
}
// sendToElastic(JSON.parse('{"mealId":"82715","name":"French Lentils With Garlic and Thyme","category":"Fish","area":"French","instructions":"lalala","ingredients":[{"name":"Olive Oil","measure":"3 tablespoons"},{"name":"Onion","measure":"1"},{"name":"Garlic","measure":"2 cloves"},{"name":"Carrot","measure":"1"},{"name":"French Lentils","measure":"2 1/4 cups"},{"name":"Thyme","measure":"1 teaspoon"},{"name":"Bay Leaf","measure":"3"},{"name":"Salt","measure":"1 tablespoon"},{"name":"Celery","measure":"2 sticks"}],"imgUrl":"http://www.themealdb.com/images/media/meals/vwwspt1487394060.jpg","videoUrl":"none","srcUrl":""}'))
execute()