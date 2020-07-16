const nav = document.querySelector('nav');
const allRecipesDisplay = document.querySelector('.all-recipes-display');
const favoriteRecipesDisplay = document.querySelector('.favorite-recipes');
const bigRecipeCard = document.querySelector('.recipe-pop-up');
const behindCardBlackout = document.querySelector('.body-blackout');
const tagList = document.querySelector('.tag-list');
// data instantiation & globals
const currentUser = new User(generateRandomUser());
const instantiatedRecipes = recipeData.map(recipe => new Recipe(recipe));
const searchMessage = document.querySelector('.search-message');
let tagsToSearch = [];
//onload 
window.onload = handleLoad();
// event listening
nav.addEventListener('click', navHandler);
allRecipesDisplay.addEventListener('click', smallRecipeHandler);
favoriteRecipesDisplay.addEventListener('click', smallRecipeHandler);
bigRecipeCard.addEventListener('click', bigRecipeHandler);
behindCardBlackout.addEventListener('click', hideBigRecipeCard);
tagList.addEventListener('click', tagHandler);
// event handling
function handleLoad() {
  propagateCards(instantiatedRecipes, allRecipesDisplay);
  propagateTagList();
  showUserName();
  labelPantry();
  populatePantry();
}

function navHandler(event) {
  if (event.target.id.includes('user')) {
    displayFavorites();
    goToPage(event.target.id);
  } else if (event.target.id.includes('recipe')) {
    propagateCards(instantiatedRecipes, allRecipesDisplay);
    goToPage(event.target.id);
  } else if (event.target.id.includes('search-button')) {
    searchIngredientsHandler(event); 
  }
}

function searchIngredientsHandler(event) {
  let searchResult;
  const searchQuery = document.querySelector('input').value;
  let recipeLocation = showSearchResults(searchQuery)
  showSearchMessage(searchQuery, recipeLocation)
}
//if array contains this splice array at indexof this
function tagHandler(event) {
  let page;
  let list;
  if (!allRecipesDisplay.classList.contains('hidden')
    && !tagList.classList.contains('hidden')) {
    page = allRecipesDisplay;
    list = instantiatedRecipes;
  } else if (!favoriteRecipesDisplay.classList.contains('hidden')
    && !tagList.classList.contains('hidden')) {
    page = favoriteRecipesDisplay;
    list = currentUser.lists.favoriteRecipes
  }
  runTag(page, list);
  resetTagsIfEmpty();
}

function favoriteRecipeHandler(event) {
  let recipe = findById(event.target.id, instantiatedRecipes);
  currentUser.toggleListItem(recipe, 'favorite');
  displayFavorites();
}

function smallRecipeHandler(event) {
  if (event.target.classList.contains('star-icon')) {
    changeFavoriteIcon(event);
    favoriteRecipeHandler(event);
  } else if (event.target.id) {
    showRecipeCard(event);
  } 
}

function bigRecipeHandler(event) {
  if (event.target.classList.contains('exit-button')) {
    hideBigRecipeCard(event);
  } else if (event.target.classList.contains('big-star-icon')) {
    favoriteRecipeHandler(event);
    changeFavoriteIcon(event);
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
  const userPageDisplay = document.querySelector('.user-window');
  const userPantry = document.querySelector('.users-pantry');
  if (buttonID === "recipe-page-button") {
    allRecipesDisplay.classList.remove('hidden');
    userPageDisplay.classList.add('hidden');
    userPantry.classList.add('hidden');
  } else if (buttonID === 'user-page-button') {
    allRecipesDisplay.classList.add('hidden');
    userPageDisplay.classList.remove('hidden');
    userPantry.classList.remove('hidden');
    displayFavorites();
  }
  searchMessage.innerText = '';
}
// DOM Tags
function runTag(page, list) {
  if (event.target.classList.contains('button-highlight')
    && event.target.classList.contains('tag-button')) {
    tagsToSearch.splice(tagsToSearch.indexOf(event.target.id), 1)
  } else if (event.target.className === 'tag-button') {
    tagsToSearch.push(event.target.id);
  }
  toggleTagHighlight(event);
  const recipesToShow = searchRecipesByTag(tagsToSearch, list);
  propagateCards(recipesToShow, page);
}

function resetTagsIfEmpty() {
  if (tagsToSearch.length === 0) {
    propagateTagList();
    propagateCards(instantiatedRecipes, allRecipesDisplay);
    displayFavorites();
  }
}

function propagateTagList() {
  const tagSection = document.querySelector('.tag-list');
  const tagList = createTagList();
  
  tagSection.innerHTML = '';
  tagList.forEach(tag => {
    tagSection.innerHTML += `<button class="tag-button" id="${tag}">${tag}</button>`;
  })
}

function createTagList() {
  const tagList = [];
  instantiatedRecipes.forEach(recipe => {
    recipe.tags.forEach(tag => {
      if (!tagList.includes(tag)) {
        tagList.push(tag);
      }
    })
  })
  return tagList;
}

const toggleTagHighlight = (event) => {
  if (event.target.classList.contains('button-highlight')) {
    event.target.classList.remove('button-highlight')
  } else {
    event.target.classList.add('button-highlight')
  }
}
// DOM recipes
const changeFavoriteIcon = (star) => {
  star = star === event ? event.target : star
  if (star.src.includes('hollow-star')) {
    star.src = '../assets/filled-in-star.svg';
  } else if (star.classList.contains('big-star-icon')) {
    star.src = '../assets/hollow-star.svg';
  } else {
    star.src = '../assets/hollow-star.png';
  }
}

function propagateCards(recipeCards, section) {
  let starIconSrc;
  section.innerHTML = '';
  recipeCards.forEach((recipe) => {
    if (!findById(recipe.id, currentUser.lists.favoriteRecipes)) {
      starIconSrc = '../assets/hollow-star.png';
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
// big recipe card
const showRecipeCard = (event) => {
  behindCardBlackout.classList.remove('hidden');
  bigRecipeCard.classList.remove('hidden');
  populateBigRecipeCard(event);
}

function hideBigRecipeCard(event) {
  bigRecipeCard.classList.add('hidden');
  behindCardBlackout.classList.add('hidden');
  if (searchMessage.innerText === '') {
    propagateCards(instantiatedRecipes, allRecipesDisplay);
  } else {
    let allStars = document.querySelectorAll('.star-icon');
    for (i = 0; i < allStars.length / 2 - 1; i++) {
      if (allStars[i].id === `${event.target.id.toString()}`) changeFavoriteIcon(allStars[i]);
    }
  }
}

const populateBigRecipeCard = (event) => {
  const currentRecipe = findById(event.target.id, instantiatedRecipes);
  const ingredientList = createIngredientList(currentRecipe);
  const fullIngredientList = generateReadableIngredientList(ingredientList, currentRecipe);
  const instructionList = currentRecipe.giveInstructions();
  insertBigCardHTML(currentRecipe);
  populateIngredients(fullIngredientList);
  populateInstructions(instructionList);
}

const insertBigCardHTML = (recipe) => {
  let starIconSrc;
  if (!findById(recipe.id, currentUser.lists.favoriteRecipes)) {
    starIconSrc = '../assets/hollow-star.svg';
  } else {
    starIconSrc = '../assets/filled-in-star.svg';
  }
  behindCardBlackout.id = `${recipe.id}`;
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
          <button class="exit-button" id="${recipe.id}">Exit</button>
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
// user page
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
// search DOM helpers
const showSearchResults = (searchQuery) => {
  if (!allRecipesDisplay.classList.contains('hidden')) {
    searchResult = search(searchQuery, instantiatedRecipes);
    propagateCards(searchResult, allRecipesDisplay);
    recipeLocation = 'our recipes'
  } else {
    searchResult = search(searchQuery, currentUser.lists.favoriteRecipes);
    propagateCards(searchResult, favoriteRecipesDisplay);
    recipeLocation = 'your favorite recipes'
  }
  return recipeLocation
}

function showSearchMessage(searchQuery, recipeLocation) {
  let sentenceQuery = searchQuery.split(', ').join(' and ');
  if (searchResult.length === 0) {
    searchMessage.innerText = `Sorry, ${recipeLocation === 'our recipes' ? 'we' : 'you'}` +
      `don't have any recipes with ${sentenceQuery} in any of ${recipeLocation}`
  } else {
    searchMessage.innerText = `Here are recipes including ${sentenceQuery} from ${recipeLocation}`
  }
  document.querySelector('input').value = ''
}
