try {
  Recipe = require('./recipe-class');
} catch (e) {
  let Recipe;
}
//class helper functions
function createId(data) {
    return typeof data === 'number' ? data : Date.now();
}

function findById(id, location) {
  id = typeof id !== 'number' ? parseInt(id) : id;
  if (!Array.isArray(location)) {
    return `this ain't gonna work (findById array issue)`
  }
  if (location[0]) {
    let signifier = typeof location[0].id === "number" ? `id` : `ingredient`;
    let ingredient = location.find(item => item[signifier] === id);

    return ingredient;
  }
}

function createIngredientList(recipe) {
  return recipe.requiredIngredients.reduce((ingredientList, ingredient) => {
    return ingredientList.concat({
      name: findById(ingredient.id, ingredientsData).name,
      id: ingredient.id,
      cost: findById(ingredient.id, ingredientsData).estimatedCostInCents,
      qty: ingredient.quantity.amount
    });
  }, []);
}

// dom helper functions
function getFirstName() {
  return currentUser.name.split(" ")[0]
}

function generateReadableIngredientList(ingredientList, recipe)  {
  const measurements = createMeasurementList(recipe);
  const fullDirectionList = measurements.reduce((directions, measurement) => {
    const ingredientMatch = ingredientList.find(ingredient => {
      return ingredientList.indexOf(ingredient) === measurements.indexOf(measurement);
    });
    const fullDirectionSentence = measurement + ingredientMatch.name;
    return directions.concat(fullDirectionSentence);
  }, []);

  return fullDirectionList;
}
// SEARCH IT
function search(searchQuery, list) {
  const queries = searchQuery.split(', ');
  const queryIds = convertQueryNamesToIDs(queries);
  const matchingRecipes = [];
  list.forEach(recipe => {
    let requiredIds = recipe.requiredIngredients.reduce((requiredIds, ingredient) => {
      requiredIds.push(ingredient.id);
      return requiredIds
    }, [])
    if (queryIds.some(query => requiredIds.includes(query))) {
      matchingRecipes.push(recipe)
    }
  })
  return matchingRecipes
}

function convertQueryNamesToIDs(ingredientNames) {
  let ingredientIds = ingredientsData.reduce((idList, ingredient) => {
    if (ingredient.name && ingredientNames.some(query => ingredient.name.includes(query))) {
      idList.push(ingredient.id);
    }
    return idList;
  }, []);

  return ingredientIds;
}
// function searchByTag();
if (typeof module !== 'undefined') {
  module.exports = {createId, createIngredientList, findById}
}