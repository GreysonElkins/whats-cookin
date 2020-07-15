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

function convertIngredientNameToID(ingredientName) {
  let ingredientIds = ingredientsData.reduce((idList, ingredient) => {
    if (ingredient.name && ingredient.name.includes(ingredientName)) idList.push(ingredient.id);
    return idList;
  }, []);

  return ingredientIds;
}

function searchRecipesByIngredient(searchInputs, recipeList) {
  const ingredientIDs = this.convertIngredientNameToID(searchInputs);
  const searchResults = recipeList.reduce((matchingRecipes, recipe) => {
    createIngredientList(recipe).forEach(recipeObject => {
      if (ingredientIDs.includes(recipeObject.id)) return recipe;
    })
    return matchingRecipes;
  }, []);

  return searchResults;
}

function matchAllTags(searchTags, recipeTags) {
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

function searchRecipesByTag(searchInputs, recipeList) {
  const searchResults = recipeList.filter(recipe => {
    if (matchAllTags(searchInputs, recipe.tags)) {
      return recipe;
    }
  });

  return searchResults;
}

function joinLists(arr1, arr2) {
  const combinedLists = arr1.forEach(item => {
    if (!arr2.includes(item)) arr2.push(item);
  })
  return arr2;
}

function search(searchQuery) {
  debugger
  const queries = searchQuery.split(',');
  const matchingRecipesByIngredient = searchRecipesByIngredient(queries, instantiatedRecipes);
  console.log(matchingRecipesByIngredient);
  const matchingRecipesByTag = searchRecipesByTag(queries, instantiatedRecipes);
  console.log(matchingRecipesByTag);
  const results = joinLists(matchingRecipesByIngredient, matchingRecipesByTag);

  console.log(results);
}

function convertIngredientNamesToID(ingredientNames) {
  let ingredientIds = ingredientsData.reduce((idList, ingredient) => {
    if (ingredient.name && ingredient.name.includes(ingredientNames)) idList.push(ingredient.id);
    return idList;
  }, []);

  return ingredientIds;
}

// function searchByIngredient(searchQuery) {
//   const queries = searchQuery.split(',');
//   const queryIds = convertIngredientNamesToID(queries);
//   const matchingRecipes = [];
//   instantiatedRecipes.forEach(recipe => {
//     if (queryIds.some(queryId => recipe.requiredIngredients.includes(queryId))) {
//       matchingRecipes.push(recipe);
//     }
//   });
//   console.log(matchingRecipes);
// }

// function searchByTag();

if (typeof module !== 'undefined') {
  module.exports = {createId, createIngredientList, findById}
}