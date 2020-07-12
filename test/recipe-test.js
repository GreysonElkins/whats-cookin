const chai = require('chai');
const expect = chai.expect;
const Recipe = require('../src/recipe-class');
const recipeData = require('../data/recipes')

describe('recipe', () => {

  let humptyDumpty, recipe, badRecipe, badEgg;

  beforeEach(() => {
    humptyDumpty = {
      id: 0,
      image: 'egg',
      ingredients: [
        {"id": 20081, quantity: {amount: 1}},
        {"id": 18372, quantity: {amount: 2}},
      ],
      instructions: [{
        'instruction': 'Get two chickens and set the mood', 'number': 1
      }, {
        'instruction': 'Leave them alone', 'number': 2
      }],
      tags: ['fragile',  'heartfelt'],
      name: 'the humpty dumpty'
    };
    badEgg = {
    }
    recipe = new Recipe(humptyDumpty);
    badRecipe = new Recipe(badEgg);
  });

  it('should be a function', () => {
    expect(Recipe).to.be.a('function');
  });

  it('should have an ID', () => {
    expect(recipe.id).to.be.a('number');
    expect(recipe.id).to.deep.equal(humptyDumpty.id);
  });

  it('should make an ID if one is not provided', () => {
    expect(badRecipe.id).to.equal(Date.now());
  })

  it('should create an ID if the wrong datatype is provided', () => {
    badEgg.id = 'pbbbbt';
    badRecipe2 = new Recipe(badEgg);
    expect(badRecipe.id).to.equal(Date.now());
  })

  it('should have an image', () => {
    expect(recipe.image).to.be.a('string');
    expect(recipe.image).to.deep.equal(humptyDumpty.image);
  });

  it('should provide a default image if there is no image', () => {
    expect(badRecipe.image).to.equal('https://spoonacular.com/recipeImages/698701-556x370.jpg')
  });
  
  it('should have ingredients', () => {
    expect(recipe.requiredIngredients).to.be.an('array');
    expect(recipe.requiredIngredients).to.deep.equal(humptyDumpty.ingredients);
  });
  
  it('it should have an array that says there are no ingredients if none are there', () => {
    expect(badRecipe.requiredIngredients).to.deep.equal([`no ingredients are listed for this recipe`])
  })

  it('should have instructions', () => {
    expect(recipe.instructions).to.be.an('array');
    expect(recipe.instructions[1]).to.deep.equal(humptyDumpty.instructions[1]);
  });

  it('should say there are no instructions if none are provided', () => {
    expect(badRecipe.instructions).to.deep.equal(['No instructions were provided, <br>I guess it\'s one of those make it up as you go cakes <br>🤷🏽‍♀️'])
  })

  it('should have a name', () => {
    expect(recipe.name).to.be.a('string');
    expect(recipe.name).to.deep.equal(humptyDumpty.name);
  });

  it('should be named untitled if there is no name provided', () => {
    expect(badRecipe.name).to.equal('untitled');
  })

  it('should have tags', () => {
    expect(recipe.tags).to.be.an('array');
    expect(recipe.tags).to.deep.equal(humptyDumpty.tags);
  });

  it('should have an empty array of tags if none are provided', () => {
    expect(badRecipe.tags).to.be.an('array')
  }) 

  it('should be able to return its instructions', () => {
    expect(recipe.giveInstructions()).to.deep.equal(['1: Get two chickens and set the mood',
      '2: Leave them alone']);
  });

  it('should be able to return the total cost of its ingredients', () => {
    expect(recipe.getTotalCost()).to.equal(7.24);
  });

  it('should be able to become a favorite', () => {
    recipe.toggleFavorite();
    expect(recipe.isFavorite).to.equal(true);
  });

  it('should be able to toggle isFavorite back to false', () => {
    recipe.toggleFavorite();
    expect(recipe.isFavorite).to.equal(true);
    recipe.toggleFavorite();
    expect(recipe.isFavorite).to.equal(false);
  });
});