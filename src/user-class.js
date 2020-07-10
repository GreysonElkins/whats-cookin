try {
  Pantry = require('./pantry-class.js');
  Recipe = require('./recipe-class.js');
  ingredientsData = require('../data/ingredients.js');
  createId = require('./scripts');
} catch(e) {
  let createId
  let Pantry;
  let Recipe;
  let ingredientsData;
}

class User {
  constructor(userData) {
    this.name = this.createName(userData.name);
    this.id = createId(userData.id);
    this.pantry = userData.pantry || [];
    this.favoriteRecipes = [];
    this.recipesToCook = [];
  }

  createName(data) {
    return typeof data === 'string' ? data : JSON.stringify(data);
  }



  chooseRecipe(recipe, recipeList) {
    if (recipe instanceof Recipe) {
      recipeList.push(recipe);
    }
  }

  searchRecipesByName(searchInput, recipeList) {
    let searchResults = recipeList.filter(recipe => {
      let recipeName = recipe.name.toLowerCase();
      return recipeName.includes(searchInput.toLowerCase());
    });

    return searchResults;
  }

  searchRecipesByIngredient(searchInput, recipeList) {
    const ingredientID = this.convertIngredientNameToID(searchInput);
    const searchResults = recipeList.filter(recipe => {
      return this.generateIngredientList(recipe).includes(ingredientID);
    });

    return searchResults; 
  }

  searchRecipesByTag(searchInput, recipeList) {
    const searchInputList = searchInput.split(',');  
    const searchResults = recipeList.filter(recipe => {
      if (this.matchAllTags(searchInputList, recipe.tags)) {
        return recipe;
      }
    });
    
    return searchResults;
  }

  convertIngredientNameToID(ingredientName) {
    let ingredient = ingredientsData.find(ingredient => {
      return ingredient.name ? ingredient.name.includes(ingredientName) : undefined;
    });
    
    return ingredient ? ingredient.id : [];
  }

  generateIngredientList = (recipe) => {
    if (recipe instanceof Recipe) {
      return recipe.requiredIngredients.map(ingredient => ingredient.id);
    } else {
      return [];
    }
  }

  matchAllTags = (searchTags, recipeTags) => {
    let indicator;
    searchTags.forEach(tag => {
      if (recipeTags.includes(tag) && indicator !== false) {
        indicator = true;
      } else {
        indicator = false;
      }
    });
    return indicator;
  }
}
if (typeof module !== 'undefined') {
  module.exports = User;
}