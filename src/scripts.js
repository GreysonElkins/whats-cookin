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

const createMeasurementList = (recipe) => {
  return recipe.requiredIngredients.map((ingredient) => {
    return `${ingredient.quantity.amount} ${ingredient.quantity.unit} of `
  });
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

  let filteredList = [... new Set(fullDirectionList)]

  return filteredList;
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
  return fullDirectionList;
  });
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

function searchRecipesByTag(searchInputs, recipeList) {
  const searchResults = recipeList.filter(recipe => {
    return searchInputs.every(input => (recipe.tags.includes(input)))
  })

  return searchResults;
}

function joinLists(arr1, arr2) {
  const combinedLists = arr1.forEach(item => {
    if (!arr2.includes(item)) arr2.push(item);
  })

  const result = trimResults(queries, matchingRecipes);

  return result
}

function convertQueryNamesToIDs(ingredientNames) {
  let ingredientIds = ingredientsData.reduce((idList, ingredient) => {
    ingredientNames.forEach(query => {
      if (ingredient.name && ingredientNames.some(query => ingredient.name.includes(query))) { 
        idList.push(ingredient.id)
      }
      });
    return idList;
  }, []);

  return ingredientIds;
}

function trimResults(queries, recipes) {
  let passableRecipes = []
  recipes.forEach(recipe => {
    let checkedQueries = [];
    queries.forEach(query => {
      recipe.requiredIngredients.forEach(ingredient => {
        let info = findById(ingredient.id, ingredientsData);
        if (info.name.includes(query)) checkedQueries.push(query);
      })
      if (queries.every(query => checkedQueries.includes(query))) passableRecipes.push(recipe)
    })
  })
  return passableRecipes;
}
// function searchByTag();
if (typeof module !== 'undefined') {
  module.exports = {createId, createIngredientList, findById}
}