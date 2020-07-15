const nav = document.querySelector('nav');
const allRecipesDisplay = document.querySelector('.all-recipes-display');
const favoriteRecipesDisplay = document.querySelector('.favorite-recipes');
const bigRecipeCard = document.querySelector('.recipe-pop-up');
const blackout = document.querySelector('.body-blackout');
const tagList = document.querySelector('.tag-list');
//data instantiation
const currentUser = new User(generateRandomUser());
const instantiatedRecipes = recipeData.map(recipe => new Recipe(recipe));
const searchMessage = document.querySelector('.search-message');
//onload 
window.onload = handleLoad();
//event listening
nav.addEventListener('click', navHandler);
allRecipesDisplay.addEventListener('click', smallRecipeHandler);
favoriteRecipesDisplay.addEventListener('click', smallRecipeHandler);
bigRecipeCard.addEventListener('click', bigRecipeHandler);
tagList.addEventListener('click', tagHandler);
blackout.addEventListener('click', hideRecipeCard);
//event handling
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
    searchHandler(event); 
  }
}

const searchHandler = () => {
  const searchQuery = document.querySelector('input').value;
  let sentenceQuery = searchQuery.split(', ').join(' and ');
  let searchResult
  if (!allRecipesDisplay.classList.contains('hidden')) {
    searchResult = search(searchQuery, instantiatedRecipes);
    propagateCards(searchResult, allRecipesDisplay);
  } else {
    searchResult = search(searchQuery, currentUser.lists.favoriteRecipes);
    propagateCards(searchResult, favoriteRecipesDisplay);
  }

  document.querySelector('input').value = ''
  if (searchResult.length === 0) {
    searchMessage.innerText = `Sorry, we don't have any ingredients with ${sentenceQuery}`
  } else {
    searchMessage.innerText = `Here are recipes including ${sentenceQuery}`
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

function tagHandler(event) {
  if (event.target.className === 'tag-button') {
    console.log(event.target.id);
    tagsToSearch.push(event.target.id);
    const recipesToShow = searchRecipesByTag(tagsToSearch, instantiatedRecipes);
    
    propagateCards(recipesToShow, allRecipesDisplay);
  } else if (event.target.className === 'clear-button') {
    tagsToSearch = [];
    propagateCards(instantiatedRecipes, allRecipesDisplay);
  }
}

// user functions
function generateRandomUser() {
  return usersData[Math.round(Math.random() * usersData.length)];
}
// 
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
}

function propagateTagList() {
  const tagSection = document.querySelector('.tag-list');
  const tagList = createTagList();
  console.log(tagList);

  tagList.forEach(tag => {
    tagSection.innerHTML += `<button type="radio" class="tag-button" id="${tag}">${tag}</button>`;
  })
  tagSection.innerHTML += `<button class="clear-button">Clear your tags</button>`;
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
  searchMessage.innerText = '';
}

const changeIcon = (event) => {
  if (event.target.src.includes('hollow-star')) {
    event.target.src = '../assets/filled-in-star.svg';
  } else if (event.target.classList.contains('big-star-icon')) {
    event.target.src = '../assets/hollow-star.svg';
  } else {
    event.target.src = '../assets/hollow-star.png';
  }
}
// big recipe card
const showRecipeCard = (event) => {
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

function hideRecipeCard() {
  const blackout = document.querySelector('.body-blackout');
  bigRecipeCard.classList.add('hidden');

  blackout.classList.add('hidden');
  
  propagateCards(instantiatedRecipes, allRecipesDisplay)
  ;
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
