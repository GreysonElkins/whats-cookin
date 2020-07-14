const chai = require('chai');
const expect = chai.expect;
const scripts = require('../src/scripts');
const ingredientsData = require('../data/ingredients')
const Recipe = require('../src/recipe-class')

describe('scripts', () => {
  describe('class helper functions', () => {
    it('should be able to create an id if a poorly formatted one is provided', () => {
      let id = createId("I'm not a number"); 
      expect(id).to.equal(Date.now());
    });
    
    it('should be able to return a correct id', () => {
      let id = createId(123);
      expect(id).to.equal(123);
    });

    it('should be able to find an ingredient by it\'s id in a given location', () => {
      let salt = {
        "id": 2047,
        "name": "salt",
        "estimatedCostInCents": 280
      };
      let searchResult = findById(2047, ingredientsData);
      expect(searchResult).to.deep.equal(salt);   
    });

    it('should be able to find an ingredient by its\' id even when the location stores ids as ingredients', () => {
      let userPantry = {"pantry": [
        {
          "ingredient": 11477,
          "amount": 4
        },
        {
          "ingredient": 11297,
          "amount": 4
        },
        {
          "ingredient": 1082047,
          "amount": 10
        },
        {
          "ingredient": 20081,
          "amount": 5
        },
      ]}
      let expectedResult = {"ingredient": 11477, "amount": 4};
      let result = findById(11477, userPantry.pantry);
      expect(result).to.deep.equal(expectedResult);
    });

    it('should be able to find a recipe by id', () => {
      greenHam = {
        'id': 12283,
        'img': 'img',
        'ingredients': [
          { id: 11477, quantity: { amount: 5 } },
          { id: 11297, quantity: { amount: 4 } },
          { id: 16069, quantity: { amount: 1 } }
        ],
        "name": "Grandma's Ham",
        "tags": ["delicious", "terrifying"]
      };
      aPerfectEgg = {
        'id': 198,
        'img': 'img',
        'ingredients': [
          { id: 20081, quantity: { amount: 5 } },
          { id: 11215, quantity: { amount: 5 } },
        ],
        "name": "A perfect egg",
        "tags": ["beautiful", "satisfying"]
      };
      let recipeCollection = [greenHam, aPerfectEgg];
      result = findById(198, recipeCollection);
      expect(result).to.equal(aPerfectEgg);
    });

    it('should return a list of ingredients for a given recipe', () => {
      const greenHam = new Recipe({
        'id': 12283,
        'img': 'img',
        'ingredients': [
          { id: 11477, quantity: { amount: 5 } },
          { id: 11297, quantity: { amount: 4 } },
          { id: 16069, quantity: { amount: 1 } }
        ],
        "name": "Grandma's Ham",
        "tags": ["delicious", "terrifying"]
      });
       expect(createIngredientList(greenHam).length).to.equal(3);
    });

    // needs tests for what the returned object looks like

    // it('should only take a recipe as an argument for generating an ingredient list', () => {
    //   const number = 123;
    //   const array = ['something', 'something'];
    //   const bool = false;

    //   expect(createIngredientList(number)).to.deep.equal([]);
    //   expect(createIngredientList(array)).to.deep.equal([]);
    //   expect(createIngredientList(bool)).to.deep.equal([]);
    //   });



  });
});