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
        // gets Added in elastic id: ,
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

console.log('transformed:', transformMeal(JSON.parse(`{
    "idMeal": "52772",
    "strMeal": "Teriyaki Chicken Casserole",
    "strCategory": "Chicken",
    "strArea": "Japanese",
    "strInstructions": "Preheat oven to 350° F. Spray a 9x13-inch baking pan with non-stick spray. Combine soy sauce, ½ cup water, brown sugar, ginger and garlic in a small saucepan and cover. Bring to a boil over medium heat. Remove lid and cook for one minute once boiling.\r\nMeanwhile, stir together the corn starch and 2 tablespoons of water in a separate dish until smooth. Once sauce is boiling, add mixture to the saucepan and stir to combine. Cook until the sauce starts to thicken then remove from heat.\r\nPlace the chicken breasts in the prepared pan. Pour one cup of the sauce over top of chicken. Place chicken in oven and bake 35 minutes or until cooked through. Remove from oven and shred chicken in the dish using two forks.\r\n*Meanwhile, steam or cook the vegetables according to package directions.\r\nAdd the cooked vegetables and rice to the casserole dish with the chicken. Add most of the remaining sauce, reserving a bit to drizzle over the top when serving. Gently toss everything together in the casserole dish until combined. Return to oven and cook 15 minutes. Remove from oven and let stand 5 minutes before serving. Drizzle each serving with remaining sauce. Enjoy!",
    "strMealThumb": "http://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg",
    "strYoutube": null,
    "strIngredient1": "soy sauce",
    "strIngredient2": "water",
    "strIngredient3": "brown sugar",
    "strIngredient4": "ground ginger",
    "strIngredient5": "minced garlic",
    "strIngredient6": "cornstarch",
    "strIngredient7": "chicken breasts",
    "strIngredient8": "stir-fry vegetables",
    "strIngredient9": "brown rice",
    "strIngredient10": "",
    "strIngredient11": "",
    "strIngredient12": "",
    "strIngredient13": "",
    "strIngredient14": "",
    "strIngredient15": "",
    "strIngredient16": null,
    "strIngredient17": null,
    "strIngredient18": null,
    "strIngredient19": null,
    "strIngredient20": null,
    "strMeasure1": "3/4 cup",
    "strMeasure2": "1/2 cup",
    "strMeasure3": "1/4 cup",
    "strMeasure4": "1/2 teaspoon",
    "strMeasure5": "1/2 teaspoon",
    "strMeasure6": "4 Tablespoons",
    "strMeasure7": "2",
    "strMeasure8": "1 (12 oz.)",
    "strMeasure9": "3 cups",
    "strMeasure10": "",
    "strMeasure11": "",
    "strMeasure12": "",
    "strMeasure13": "",
    "strMeasure14": "",
    "strMeasure15": "",
    "strMeasure16": null,
    "strMeasure17": null,
    "strMeasure18": null,
    "strMeasure19": null,
    "strMeasure20": null,
    "strSource": null,
    "dateModified": null
    }`.split('\r\n').join(' '))))