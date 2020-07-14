try {
  ingredientsData = require('../data/ingredients.js');
  scripts = require('./scripts');
  createId = scripts.createId;
  createIngredientList = scripts.createIngredientList;
} catch (e) {
  let createIngredientList;
  let scripts
  let createId;
  let ingredientsData;
}

class Recipe {
  constructor(recipe) {
    this.id = createId(recipe.id);
    this.image = recipe.image || 'https://spoonacular.com/recipeImages/698701-556x370.jpg';
    this.requiredIngredients = recipe.ingredients || [`no ingredients are listed for this recipe`];
    this.instructions = recipe.instructions || ['No instructions were provided, <br>I guess it\'s one of those make it up as you go cakes <br>🤷🏽‍♀️'];
    this.name = recipe.name || 'untitled';
    this.tags = recipe.tags || [];
    this.isFavorite = false;  
  }

  giveInstructions() {
    return this.instructions.reduce((list, direction) => {
      return list.concat(`${direction.number}: ${direction.instruction}`)
    }, []);
  }

  toggleFavorite() {
    this.isFavorite = this.isFavorite ? false : true;
  }

  getTotalCost() {
    const ingredientList = createIngredientList(this);

    return ingredientList.reduce((totalPrice, ingredient) => {
      return totalPrice += ingredient.cost * ingredient.qty / 100;
    }, 0);
  }
}

if (typeof module !== 'undefined') {
  module.exports = Recipe;
  }