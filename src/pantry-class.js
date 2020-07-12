try {
  Recipe = require('./recipe-class.js');
  ingredientsData = require('../data/ingredients');
} catch (e) {
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

  findIngredientName(id) {
    if (typeof id === 'number') {
      let ingredient = ingredientsData.find(item => item.id === id);
      return ingredient.name;
    }
  }

  findMissingIngredients = (recipe) => {
    if (recipe instanceof Recipe === false) {
      return 'This is not a recipe'
    }

    let supplyList = this.checkPantryForRecipeIngredients(recipe); 
    let message = [];
    
    recipe.requiredIngredients.forEach(ingredient => {
      let pantryItem = this.findItem(supplyList, ingredient);
      let qtyDifference = pantryItem ? ingredient.quantity.amount - pantryItem.amount : ingredient.quantity.amount;
      
      qtyDifference > 0 ? message.push(`${qtyDifference} ${this.findIngredientName(ingredient.id)}`) : () => {};
    });
    if (message.length > 0) {
      return `You still need ${message.join(' and ')} to make ${recipe.name}`
    } else {
      return 'All the required ingredients are in the pantry'
    }
  }

  useIngredients = (recipe) => {
    if(this.findMissingIngredients(recipe) !== 'All the required ingredients are in the pantry') {
      return 'You do not have the required ingredients'
    }

    recipe.requiredIngredients.forEach(ingredient => {
      let pantryItem = this.findItem(this.supplies, ingredient);
      pantryItem.amount -= ingredient.quantity.amount;
    })
  }

  findItem = (location, ingredient) => {
    return location.find(item => item.ingredient === ingredient.id)
  }
 }
 
if (typeof module !== 'undefined') {
  module.exports = Pantry;
}
