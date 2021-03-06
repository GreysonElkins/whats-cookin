try {
  Recipe = require('./recipe-class.js');
  ingredientsData = require('../data/ingredients');
  scripts = require('./scripts');
  findById = scripts.findById;
} catch (e) {
  let findById
  let scripts;
  let Recipe;
  let ingredientsData;
}

class Pantry {
  constructor(pantry) {
    this.supplies = [];
    Array.isArray(pantry) ? this.checkIngredients(pantry) : () => {};
  }

  checkIngredients = (pantry) => {
    return pantry.forEach(ingredient => {
      if (typeof ingredient.ingredient === 'number' &&
        typeof ingredient.amount === 'number') {
        this.supplies.push(ingredient);
      }
    });
  }

  compareIngredients(ingredient1, ingredient2) {
    if (ingredient1.id && ingredient2.ingredient) { 
     return ingredient1.id === ingredient2.ingredient ? true : false;
    } else if (ingredient1.ingredient && ingredient2.id) {
      return ingredient1.ingredient === ingredient2.id ? true : false;
    } else {
      return `something is wrong with compareIngredients()`
    }
  }

  checkPantryForRecipeIngredients = (recipe) => {
    if (recipe instanceof Recipe === false) {
      return 'This is not a recipe'
    }
    let supplyList = [];
    recipe.requiredIngredients.forEach(reqIngredient => {
      this.supplies.forEach(supIngredient => {
        if (this.compareIngredients(reqIngredient, supIngredient)) {
          supplyList.push(supIngredient);
        }
      })
    })
    return supplyList
  }

  showMissingIngredients = (recipe) => {
    if (recipe instanceof Recipe === false) {
      return 'This is not a recipe'
    }

    let missingIngredients = this.findMissingIngredients(recipe);
    let message = [];
    
    missingIngredients.forEach(ingredient => {
       message.push(`${ingredient.qty} ${findById(ingredient.ingredient, ingredientsData).name}`);
    });

    if (message.length > 0) {
      return `You still need ${message.join(' and ')} to make ${recipe.name}`
    } else {
      return 'All the required ingredients are in the pantry'
    }
  }
  
  findMissingIngredients = (recipe) => {
    let supplyList = this.checkPantryForRecipeIngredients(recipe);
    let missingIngredients = []
    
    recipe.requiredIngredients.forEach(ingredient => {
      let pantryItem = findById(ingredient.id, supplyList);
      let qtyDifference = pantryItem ? ingredient.quantity.amount - pantryItem.amount : ingredient.quantity.amount;

      qtyDifference > 0 ? missingIngredients.push({ingredient: ingredient.id, qty: qtyDifference}) : () => {};
    })

    return missingIngredients;
  }

  findIngredientsCost = (recipe) => {
    let missingIngredients = this.findMissingIngredients(recipe);
    let cost = 0;
    missingIngredients.forEach(missingItem => {
      let ingredientCost = ingredientsData.find(ingredient => ingredient.id === missingItem.ingredient).estimatedCostInCents / 100;
      cost += ingredientCost * missingItem.qty; 
    })
    return cost;
  }

  useIngredients = (recipe) => {
    if(this.showMissingIngredients(recipe) !== 'All the required ingredients are in the pantry') {
      return 'You do not have the required ingredients'
    }

    recipe.requiredIngredients.forEach(ingredient => {
      let pantryItem = findById(ingredient.id, this.supplies);
      pantryItem.amount -= ingredient.quantity.amount;
    })
  }
}

if (typeof module !== 'undefined') {
  module.exports = Pantry;
}
