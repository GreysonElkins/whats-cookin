const chai = require('chai');
const expect = chai.expect;
const User = require('../src/user-class.js');
const Recipe = require('../src/recipe-class.js');

describe('user', () => {

  let user, grandma, greenHam, aPerfectEgg;

  beforeEach(() => {
    greenHam = new Recipe({
      'id': 12283,
      'img': 'img',
      'ingredients': [
        { id: 11477, amount: 5 },
        { id: 11297, amount: 4 },
        { id: 16069, amount: 1 }
      ],
      "name": "Grandma's Ham",
      "tags": ["delicious", "terrifying"]
    });
    aPerfectEgg = new Recipe({
      'id': 12283,
      'img': 'img',
      'ingredients': [
        { id: 20081, amount: 5 },
        { id: 11215, amount: 5 },
      ],
      "name": "A perfect egg",
      "tags": ["beautiful", "satisfying"]
    });
    grandma = {
      "name": "Sugar Baby",
      "id": 3000,
      "pantry": [
        {"ingredient": 11477, "amount": 4},
        {"ingredient": 11297, "amount": 4},
        {"ingredient": 1082047, "amount": 10},
        {"ingredient": 20081, "amount": 5},
      ]
    }
    user = new User(grandma);
  });

  it('should be a function', () => {
    expect(User).to.be.a('function');
  });

  it('should have a name', () => {
    expect(user.name).to.deep.equal(grandma.name);
  });

  it('should only have a string as a name', () => {
    const robotChef = new User({name: 12567, id: 1, pantry: []});
    expect(robotChef.name).to.equal('12567');
  });

  it('should have an ID', () => {
    expect(user.id).to.deep.equal(grandma.id);
  });

  it('should assign a number for an ID if no number is given', () => {
    const karen = new User({name: 'Karen', id: 'I don\'t believe in numbers', pantry: [{ingredient: 'essential oils'}]});
    const anotherRobotChef = new User({ name: 12567, id: ['Error'], pantry: []});

    expect(karen.id).to.equal(Date.now());
    expect(anotherRobotChef.id).to.equal(Date.now());
  });

  it('should have a pantry that can contain ingredients', () => {
    expect(user.pantry).to.deep.equal(grandma.pantry);
  });

  it('should have an empty array if no pantry is provided', () => {
    const brokeJohn = new User({name: 'Jimmy'});
    expect(brokeJohn.pantry).to.deep.equal([]);
  })

  it('should start with an empty array of favorite recipes', () => {
    expect(user.favoriteRecipes).to.be.an('array');
    expect(user.favoriteRecipes).to.deep.equal([]);
  });

  it('should start with an empty array of recipes to cook', () => {
    expect(user.recipesToCook).to.be.an('array');
    expect(user.recipesToCook).to.deep.equal([]);
  });

  it('should be able to add a recipe to its list of favorites', () => {
    user.chooseRecipe(greenHam, user.favoriteRecipes);
    expect(user.favoriteRecipes[0]).to.deep.equal(greenHam);
  });

  it('should be able to add a recipe to its list of recipes to cook', () => {
    user.chooseRecipe(greenHam, user.recipesToCook);
    expect(user.recipesToCook[0]).to.deep.equal(greenHam);
  });

  it('should only be able to add recipes to its recipe lists', () => {
    const recipe = 'Delicious food';
    const otherRecipe = 42;
    user.chooseRecipe(recipe, user.favoriteRecipes);
    user.chooseRecipe(otherRecipe, user.recipesToCook);
    expect(user.favoriteRecipes).to.deep.equal([]);
    expect(user.recipesToCook).to.deep.equal([]);
  });

  it('should only add unique recipes to its favorites', () => {
    user.chooseRecipe(greenHam, user.favoriteRecipes);
    user.chooseRecipe(greenHam, user.favoriteRecipes);

    expect(user.favoriteRecipes).to.deep.equal([greenHam]);
  });

  it('should let the user search for a recipe by name', () => {
    user.chooseRecipe(aPerfectEgg, user.recipesToCook);
    user.chooseRecipe(aPerfectEgg, user.favoriteRecipes);

    const searchResults1 = user.searchRecipesByName('A perfect egg', user.recipesToCook);
    const searchResults2 = user.searchRecipesByName('A perfect egg', user.favoriteRecipes);

    expect(searchResults1[0]).to.equal(aPerfectEgg);
    expect(searchResults2[0]).to.equal(aPerfectEgg);
  })

  it('should be able to convert an ingredient name to its id', () => {
    const wheatFlourID = user.convertIngredientNameToID('wheat');
    const wheatFlourID2 = user.convertIngredientNameToID('whe');
    const wheatFlourID3 = user.convertIngredientNameToID('wheat flour');
    /// this seems like it does too much
    expect(wheatFlourID).to.equal(20081);
    expect(wheatFlourID2).to.equal(20081);
    expect(wheatFlourID3).to.equal(20081);
  });

  it('should return an empty array if no matching id is found', () => {
    const randomSearch = user.convertIngredientNameToID('a car');

    expect(randomSearch).to.deep.equal([]);
  });

  it('should return a list of ingredients for a given recipe', () => {
    expect(user.generateIngredientList(greenHam)).to.deep.equal([11477, 11297, 16069]);
  });

  it('should only take a recipe as an argument for generating an ingredient list', () => {
    const number = 123;
    const array = ['something', 'something'];
    const bool = false;

    expect(user.generateIngredientList(number)).to.deep.equal([]);
    expect(user.generateIngredientList(array)).to.deep.equal([]);
    expect(user.generateIngredientList(bool)).to.deep.equal([]);
    });

  it('should be able to return a list of recipes that include a specified ingredient', () => {
    user.chooseRecipe(aPerfectEgg, user.favoriteRecipes);
    user.chooseRecipe(greenHam, user.favoriteRecipes);
    user.chooseRecipe(aPerfectEgg, user.recipesToCook);
    user.chooseRecipe(greenHam, user.recipesToCook);

    const searchResults1 = user.searchRecipesByIngredient('wheat flour', user.favoriteRecipes);
    const searchResults2 = user.searchRecipesByIngredient('zucchini squash', user.recipesToCook);

    expect(searchResults1).to.deep.equal([aPerfectEgg]);
    expect(searchResults2).to.deep.equal([greenHam]);
  });

  it('should tell you if a recipe contains all the tags that you\'ve searched', () => {
    const tags = ['beautiful', 'satisfying'];
    const result = user.matchAllTags(tags, aPerfectEgg.tags);
    tags.push('round');
    const falseResult = user.matchAllTags(tags, aPerfectEgg.tags);

    expect(result).to.be.true;
    expect(falseResult).to.be.false;
  });

  it('should be able to return a list of recipes with tags that match a provided list', () => {
    user.chooseRecipe(aPerfectEgg, user.favoriteRecipes);
    user.chooseRecipe(greenHam, user.favoriteRecipes);
    user.chooseRecipe(aPerfectEgg, user.recipesToCook);
    user.chooseRecipe(greenHam, user.recipesToCook);

    const searchResults1 = user.searchRecipesByTag('beautiful', user.recipesToCook);
    const searchResults2 = user.searchRecipesByTag('terrifying', user.favoriteRecipes);

    expect(searchResults1).to.deep.equal([aPerfectEgg]);
    expect(searchResults2).to.deep.equal([greenHam]);
  });

  it('should return false if any incorrect tags are present', () => {
    const searchResults = user.matchAllTags(['beautiful', 'round'], aPerfectEgg.tags);
    const searchResults2 = user.matchAllTags(['round', 'beautiful'], aPerfectEgg.tags);
    const searchResults3 = user.matchAllTags(['beautiful'], aPerfectEgg.tags);

    expect(searchResults).to.be.false;
    expect(searchResults2).to.be.false;
    expect(searchResults3).to.be.true;
  });

  it('should return false if any incorrect tags are present with a different recipe', () => {
    const searchResults = user.matchAllTags(['terrifying', 'sauce', 'delicious'], greenHam.tags);
    const searchResults2 = user.matchAllTags(['terrifying', 'delicious', 'sauce'], greenHam.tags);
    const searchResults3 = user.matchAllTags(['terrifying', 'delicious'], greenHam.tags);

    expect(searchResults).to.be.false;
    expect(searchResults2).to.be.false;
    expect(searchResults3).to.be.true;
  });
});