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
    this.instructions = recipe.instructions || ['No instructions were provided, <br>I guess it\'s one of those make it up as you go cakes <br>🤷🏽‍♀️'];
    this.requiredIngredients = recipe.ingredients || recipe.requiredIngredients || [`no ingredients are listed for this recipe`];
    this.name = recipe.name || 'untitled';
    this.tags = recipe.tags || [];
  }

  giveInstructions() {
    return this.instructions.reduce((list, direction) => {
      return list.concat(`${direction.number}: ${direction.instruction}`)
    }, []);
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