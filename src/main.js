const allRecipesDisplay = document.querySelector('.all-recipes-display');
const nav = document.querySelector('nav');
const mainRecipeCard = document.querySelector('.recipe-pop-up');

const currentUser = new User(generateRandomUser());
//event listening
allRecipesDisplay.addEventListener('click', cardEventHandler);
nav.addEventListener('click', navEventHandler);
mainRecipeCard.addEventListener('click', recipeEventHandler);

function cardEventHandler(event) {
  if (event.target.classList.contains('star-icon')) {
    console.log(`Oh you think recipe ${event.path[2].id} looks good?`)
  } else if (event.target.id) {
    console.log(`I see recipe ${event.target.id}`);
    showRecipeCard(event);
  }
}

function navEventHandler(event) {
  if(event.target.id === "recipe-page-button" ) {
    console.log('You\'re already looking at the recipe page dangus');
    goToAllRecipes();
  } else if (event.target.id === "user-page-button") {
    console.log(`Oh, typical ${currentUser.name}, always clicking on their self.`)
    goToUser();
  }
}

function recipeEventHandler(event) {
  if (event.target.classList.contains('exit-button')) {
    hideRecipeCard();
  }
}

// page manipulation
const propagateCards = (recipeCards) => {
  recipeCards.forEach((recipe) => {
    allRecipesDisplay.innerHTML += 
    `<div class="recipe-card" id="${recipe.id}" style="background-image: url(${recipe.image})">
    <div class="card-info">
    <img class="star-icon"" src="https://www.clipartmax.com/png/middle/175-1753277_free-image-on-pixabay-star-icon-png.png" />
    <div class="recipe-title" id="${recipe.id}">${recipe.name}</div>
    </div>
    </div>`
  })
}

const goToUser = () => {
  allRecipesDisplay.classList.add('hidden');
}

const goToAllRecipes = () => {
  allRecipesDisplay.classList.remove('hidden');
}

const showRecipeCard = (event) => {
  const blackout = document.querySelector('.body-blackout');

  mainRecipeCard.classList.remove('hidden');
  blackout.classList.remove('hidden');
  populateRecipeCard(event);
}

const populateRecipeCard = (event) => {
  const currentRecipe = new Recipe(retrieveCard(event.target.id));
  const ingredientList = currentRecipe.createIngredientList();
  const fullIngredientList = generateReadableIngredientList(ingredientList, currentRecipe);
  const instructionList = currentRecipe.giveInstructions();

  insertCardHTML(currentRecipe);
  populateIngredients(fullIngredientList);
  populateInstructions(instructionList);
}

const insertCardHTML = (recipe) => {
  mainRecipeCard.innerHTML =
  `<button class="exit-button">Back to all recipes</button>
  <img class="star-icon"" src="https://www.clipartmax.com/png/middle/175-1753277_free-image-on-pixabay-star-icon-png.png" />
  <img class="recipe-img" src="${recipe.image}"></img>
  <h2>Ingredients</h2>
  <section class="ingredients"></section>
  <h2>Instructions</h2>
  <section class="instructions"></section>
  `
}

const populateIngredients = (fullIngredientList) => {
  const ingredientsSection = document.querySelector('.ingredients');

  fullIngredientList.forEach(ingredient => {
    ingredientsSection.innerHTML +=
    `<p class="ingredient">${ingredient}</p>`
  })
};

const populateInstructions = (instructionList) => {
  const instructionsSection = document.querySelector('.instructions');

  instructionList.forEach(instruction => {
    instructionsSection.innerHTML +=
    `<p class="instruction">${instruction}</p>`
  })
}

const generateReadableIngredientList = (ingredientList, recipe) => {
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

const createMeasurementList = (recipe) => {
  return recipe.requiredIngredients.map((ingredient) => {
    return `${ingredient.quantity.amount} ${ingredient.quantity.unit} of `
  });
}

const hideRecipeCard = () => {
  const blackout = document.querySelector('.body-blackout');

  mainRecipeCard.classList.add('hidden');
  blackout.classList.add('hidden');
}

// user functions
function generateRandomUser() {
  return usersData[Math.round(Math.random() * usersData.length)];
}

const showUser = () => {
  userButton = document.getElementById('user-page-button');

  userButton.innerText = currentUser.name.toUpperCase();
}

window.onload = propagateCards(recipeData);
window.onload = showUser();

// other (could possibly put this in one of the class files, I'll start with it here)

const retrieveCard = (cardID) => {
  return recipeData.find(recipe => recipe.id == cardID);
}
