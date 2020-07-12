const bigRecipeCard = document.querySelector('.recipe-pop-up');
const allRecipesDisplay = document.querySelector('.all-recipes-display');
const userPageDisplay = document.querySelector('.user-window');
const favoriteRecipesDisplay = document.querySelector('.favorite-recipes');
const nav = document.querySelector('nav');
//data instantiation
const currentUser = new User(generateRandomUser());
// const currentUser = new User(usersData[0]);
const instantiatedRecipes = recipeData.map(recipe => new Recipe(recipe));
//onload 
window.onload = handleLoad();
//event listening
allRecipesDisplay.addEventListener('click', smallRecipeHandler);
favoriteRecipesDisplay.addEventListener('click', smallRecipeHandler);
bigRecipeCard.addEventListener('click', bigRecipeHandler);
nav.addEventListener('click', navHandler);
//event handling
function handleLoad() {
  propagateCards(instantiatedRecipes, allRecipesDisplay);
  showUserName();
  labelPantry();
  populatePantry();
  displayFavorites();
  toggleFavoriteLogo(instantiatedRecipes);
}

function smallRecipeHandler(event) {
  if (event.target.classList.contains('star-icon')) {
    currentRecipe = findById(event.path[2].id, instantiatedRecipes);
    favoriteHandler(currentRecipe);
  } else if (event.target.id) {
    console.log(`I see recipe ${event.target.id}`);
    bigRecipeCard.classList.add(event.target.id);
    showRecipeCard(event);
  } 
}

function navHandler(event) {
  if (event.target.id.includes('page')) {
    goToPage(event.target.id); 
  }
}

function bigRecipeHandler(event) {
  const currentRecipe = findById(event.path[2].classList[1], instantiatedRecipes);

  if (event.target.classList.contains('exit-button')) {
    bigRecipeCard.classList.remove(currentRecipe.id);
    hideRecipeCard();
  } else if (event.target.classList.contains('ingredient-check')) {
    showIngredientsNeeded(event);
  } else if (event.target.classList.contains('star-icon')) {
    favoriteHandler(currentRecipe);
  }
}
// user functions
function generateRandomUser() {
  return usersData[Math.round(Math.random() * usersData.length)];
}

function showUserName() {
  userButton = document.getElementById('user-page-button');

  userButton.innerText = currentUser.name.toUpperCase();
}
// page views
const goToPage = (buttonID) => {
  if (buttonID === "recipe-page-button") {
    allRecipesDisplay.classList.remove('hidden');
    userPageDisplay.classList.add('hidden');
  } else if (buttonID === "user-page-button") {
    allRecipesDisplay.classList.add('hidden');
    userPageDisplay.classList.remove('hidden');
    displayFavorites();
  }
}

function propagateCards(recipeCards, section) {
  recipeCards.forEach((recipe) => {
    section.innerHTML +=
      `<div class="recipe-card" id="${recipe.id}" style="background-image: url(${recipe.image})">
    <div class="card-info">
    <img class="star-icon" id="${recipe.id}" src="" />
    <div class="recipe-title" id="${recipe.id}">${recipe.name}</div>
    </div>
    </div>`
  });
}

const alertFavorite = (recipe) => {
  if (currentUser.favoriteRecipes.includes(recipe)) {
    window.alert(`You've already added ${recipe.name} to your favorites!`);
  } else {
    window.alert(`${recipe.name} has been added to your favorite recipes!`);
  }
};

const favoriteHandler = (recipe) => {
  alertFavorite(recipe);
  recipe.toggleFavorite;
  currentUser.chooseRecipe(recipe, currentUser.favoriteRecipes);
}

const toggleFavoriteLogo = (recipes) => {
  const starIcon = document.querySelectorAll('.star-icon');
  recipes.forEach(recipe => {
    if (recipe.isFavorite === true) {
      starIcon.src = '../assets/filled-in-star.svg';
    } else {
      starIcon.src = '../assets/hollow-star.svg';
    }
  })
}

// big recipe card
const showRecipeCard = (event) => {
  const blackout = document.querySelector('.body-blackout');

  bigRecipeCard.classList.remove('hidden');
  blackout.classList.remove('hidden');
  populateRecipeCard(event);
}

const populateRecipeCard = (event) => {
  const currentRecipe = findById(event.target.id, instantiatedRecipes);
  const ingredientList = currentRecipe.createIngredientList();
  const fullIngredientList = generateReadableIngredientList(ingredientList, currentRecipe);
  const instructionList = currentRecipe.giveInstructions();

  insertCardHTML(currentRecipe);
  populateIngredients(fullIngredientList);
  populateInstructions(instructionList);
}

const insertCardHTML = (recipe) => {
  bigRecipeCard.innerHTML =
    `<img class="recipe-img" src="${recipe.image}"></img>
    <h1>${recipe.name}</h1> <br>
    <div class="recipe-card-nav">
      <img class="star-icon" id="${recipe.id}" src="" />
      <button class="ingredient-check" id="${recipe.id}">Do I have enough ingredients?</button>
      <button class="exit-button">Back to all recipes</button>
      </div>
      <br><div class="generated-message"></div>
  
    <article class="recipe-info">
      <div class="ingredients">
        <h2>Ingredients</h2>
      </div>
      <div class="instructions">
        <h2>Instructions</h2>
    </div>
    </article>
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

const createMeasurementList = (recipe) => {
  return recipe.requiredIngredients.map((ingredient) => {
    return `${ingredient.quantity.amount} ${ingredient.quantity.unit} of `
  });
}

const hideRecipeCard = () => {
  const blackout = document.querySelector('.body-blackout');
  bigRecipeCard.classList.add('hidden');

  blackout.classList.add('hidden');
}

const showIngredientsNeeded = (event) => {
  let thisRecipe = findById(event.target.id, instantiatedRecipes);
  messageHolder = document.querySelector('.generated-message');
  messageHolder.innerHTML = currentUser.pantry.findMissingIngredients(thisRecipe);
}
//user page
const makeFavoriteRecipe = (event) => {
  let chosenRecipe = findById(event.target.id, instantiatedRecipes);
  currentUser.chooseRecipe(chosenRecipe, currentUser.favoriteRecipes);
}

function displayFavorites() {
  const favoriteRecipesDisplay = document.querySelector('.favorite-recipes');
  favoriteRecipesDisplay.innerHTML = '';
  propagateCards(currentUser.favoriteRecipes, favoriteRecipesDisplay);
}

function labelPantry() {
  const pantryName = document.querySelector('.users-pantry');
  pantryName.innerHTML = `${getFirstName(currentUser)}'s Pantry: 
    <div class="supply-list"></div>`;
  }

function populatePantry() {
  const pantryList = document.querySelector('.supply-list');
  if (currentUser.pantry.supplies === []) {
    pantryList.innerText = `You need some ingredients!`
    } else {
      currentUser.pantry.supplies.forEach(supply => {
      pantryList.innerHTML += `${supply.amount} - ${currentUser.pantry.findIngredientName(supply.ingredient)} <br>`
    })
  }  
}
// other (could possibly put this in one of the class files, I'll start with it here)

function findById(id, location) {
  id = typeof id !== 'number' ? parseInt(id) : id;
  if (Array.isArray(location)) {
    let ingredient = location.find(item => item.id === id);
    return ingredient;
  }
}

function getFirstName() {
  return currentUser.name.split(" ")[0]
}