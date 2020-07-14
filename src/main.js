const nav = document.querySelector('nav');
const allRecipesDisplay = document.querySelector('.all-recipes-display');
const favoriteRecipesDisplay = document.querySelector('.favorite-recipes');
const bigRecipeCard = document.querySelector('.recipe-pop-up');
const blackout = document.querySelector('.body-blackout')
//data instantiation
// const currentUser = new User(generateRandomUser());
const currentUser = new User(usersData[0]);
const instantiatedRecipes = recipeData.map(recipe => new Recipe(recipe));
//onload 
window.onload = handleLoad();
//event listening
nav.addEventListener('click', navHandler);
allRecipesDisplay.addEventListener('click', smallRecipeHandler);
favoriteRecipesDisplay.addEventListener('click', smallRecipeHandler);
bigRecipeCard.addEventListener('click', bigRecipeHandler);
blackout.addEventListener('click', hideRecipeCard);
//event handling
function handleLoad() {
  propagateCards(instantiatedRecipes, allRecipesDisplay);
  showUserName();
  labelPantry();
  populatePantry();
  // displayFavorites();
}

function navHandler(event) {
  if (event.target.id.includes('user')) {
    displayFavorites();
    goToPage(event.target.id);
  } else if (event.target.id.includes('recipe')) {
    propagateCards(instantiatedRecipes, allRecipesDisplay);
    goToPage(event.target.id);
  }
}

const favoriteHandler = (event) => {
  let recipe = findById(event.target.id, instantiatedRecipes);
  currentUser.toggleListItem(recipe, 'favorite');
  displayFavorites(currentUser.lists.favoriteRecipes, favoriteRecipesDisplay);
}

function smallRecipeHandler(event) {
  if (event.target.classList.contains('star-icon')) {
    changeIcon(event);
    favoriteHandler(event); // handler event
  } else if (event.target.id) {
    showRecipeCard(event);
  } 
}

function bigRecipeHandler(event) {
  if (event.target.classList.contains('exit-button')) {
    hideRecipeCard();
  } else if (event.target.classList.contains('big-star-icon')) {
    favoriteHandler(event);
    changeIcon(event);
  } else if (event.target.classList.contains('ingredient-check')) {
    printMissingIngredients(event);
  } else if (event.target.classList.contains('cost-calculator')) {
    printIngredientsCost(event);
  } 

}
// user functions
function generateRandomUser() {
  return usersData[Math.round(Math.random() * usersData.length)];
}

function showUserName() {
  const userButton = document.getElementById('user-page-button');
  userButton.innerText = currentUser.name.toUpperCase();
}
// page views
const goToPage = (buttonID) => {
  let userPageDisplay = document.querySelector('.user-window');
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
  let starIconSrc;
  section.innerHTML = '';
  recipeCards.forEach((recipe) => {
    if (!findById(recipe.id, currentUser.lists.favoriteRecipes)) {
      starIconSrc = '../assets/hollow-star.svg';
    } else {
      starIconSrc = '../assets/filled-in-star.svg';
    }
    section.innerHTML +=
    `<div class="recipe-card" id="${recipe.id}" style="background-image: url(${recipe.image})">
    <div class="image-overlay" id="${recipe.id}"></div>
      <div class="card-info">
        <img class="star-icon" id="${recipe.id}" src="${starIconSrc}">
        <div class="recipe-title" id="${recipe.id}">${recipe.name}</div>
      </div>
    </div>`
  });
}

const changeIcon = (event) => {
  if (event.target.src.includes('hollow-star.svg')) {
    event.target.src = '../assets/filled-in-star.svg';
  } else {
    event.target.src = '../assets/hollow-star.svg'
  }
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
  const ingredientList = createIngredientList(currentRecipe);
  const fullIngredientList = generateReadableIngredientList(ingredientList, currentRecipe);
  const instructionList = currentRecipe.giveInstructions();

  insertCardHTML(currentRecipe);
  populateIngredients(fullIngredientList);
  populateInstructions(instructionList);
}

const insertCardHTML = (recipe) => {
  let starIconSrc;

  if (!findById(recipe.id, currentUser.lists.favoriteRecipes)) {
    starIconSrc = '../assets/hollow-star.svg';
  } else {
    starIconSrc = '../assets/filled-in-star.svg';
  }

  bigRecipeCard.innerHTML =
    `<div class="container">
      <img class="recipe-img" src="${recipe.image}"></img>
    </div>
    <div class="big-recipe-text">
      <div class="recipe-header">
        <h1>${recipe.name} $${recipe.getTotalCost().toFixed(2)}</h1> <br>
        <div class="recipe-card-nav">
          <img class="big-star-icon" id="${recipe.id}" src="${starIconSrc}">
          <button class="ingredient-check" id="${recipe.id}">Do I have enough ingredients?</button>
          <button class="exit-button">Exit</button>
        </div>
      </div>
      <br>
    <div class="generated-message"></div>
      <article class="recipe-info">
        <div class="ingredients">
          <h2>Ingredients</h2>
        </div>
        <div class="instructions">
          <h2>Instructions</h2>
      </div>
      </article>
    </div>
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

function hideRecipeCard() {
  const blackout = document.querySelector('.body-blackout');
  bigRecipeCard.classList.add('hidden');

  blackout.classList.add('hidden');
  propagateCards(instantiatedRecipes, allRecipesDisplay);
}

const printMissingIngredients = (event) => {
  let thisRecipe = findById(event.target.id, instantiatedRecipes);
  let messageHolder = document.querySelector('.generated-message');
  messageHolder.innerHTML = `${currentUser.pantry.showMissingIngredients(thisRecipe)}
    <br><div class="cost">
      <div class="recipe-card-nav">
        <button class="cost-calculator" id=${thisRecipe.id}>How much will these cost?</button>
      </div>
    </div>`
}

const printIngredientsCost = (event) => {
  let thisRecipe = findById(event.target.id, instantiatedRecipes);
  let costMessage = document.querySelector('.cost');
  costMessage.innerText = `It will cost $${currentUser.pantry.findIngredientsCost(thisRecipe).toFixed(2)}.`
}
//user page
const makeFavoriteRecipe = (event) => {
  let chosenRecipe = findById(event.target.id, instantiatedRecipes);
  currentUser.toggleListItem(chosenRecipe, 'favorite');
}

function displayFavorites() {
  const favoriteRecipesDisplay = document.querySelector('.favorite-recipes');
  favoriteRecipesDisplay.innerHTML = '';
  propagateCards(currentUser.lists.favoriteRecipes, favoriteRecipesDisplay);
}

function labelPantry() {
  const pantryName = document.querySelector('.users-pantry');
  pantryName.innerHTML = `<h1 class="pantry-title">${getFirstName(currentUser)}'s Pantry:</h1> 
    <div class="supply-list"></div>`;
  }

function populatePantry() {
  const pantryList = document.querySelector('.supply-list');
  if (currentUser.pantry.supplies === []) {
    pantryList.innerText = `You need some ingredients!`
    } else {
      currentUser.pantry.supplies.forEach(supply => {
      pantryList.innerHTML += `<p>${supply.amount} - ${findById(supply.ingredient, ingredientsData).name}</p>`
    })
  }  
}
