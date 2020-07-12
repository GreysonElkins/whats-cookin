const chai = require('chai');
const expect = chai.expect;
const Pantry = require('../src/pantry-class');
const Recipe = require('../src/recipe-class');

describe('Pantry', () => {
  let pantry, pantrySupply, badPantry, greenHam;

  beforeEach(() => {
    pantrySupply = [
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
      {
        "ingredient": 11215,
        "amount": 5
      },
      {
        "ingredient": 2047,
        "amount": 6
      },
      {
        "ingredient": 1123,
        "amount": 8
      },
      {
        "ingredient": 11282,
        "amount": 4
      },
      {
        "ingredient": 6172,
        "amount": 2
      },
      {
        "ingredient": 2044,
        "amount": 2
      },
      {
        "ingredient": 2050,
        "amount": 4
      },
      {
        "ingredient": 1032009,
        "amount": 3
      },
      {
        "ingredient": 5114,
        "amount": 3
      },
      {
        "ingredient": 1017,
        "amount": 2
      },
      {
        "ingredient": 18371,
        "amount": 7
      },
      {
        "ingredient": 1001,
        "amount": 6
      },
      {
        "ingredient": 99223,
        "amount": 2
      },
      {
        "ingredient": 1230,
        "amount": 2
      },
      {
        "ingredient": 9152,
        "amount": 4
      },
      {
        "ingredient": 10611282,
        "amount": 2
      },
      {
        "ingredient": 93607,
        "amount": 2
      },
      {
        "ingredient": 14106,
        "amount": 4
      },
      {
        "ingredient": 1077,
        "amount": 4
      },
      {
        "ingredient": 6150,
        "amount": 2
      },
      {
        "ingredient": 1124,
        "amount": 2
      },
      {
        "ingredient": 10011693,
        "amount": 4
      },
      {
        "ingredient": 1102047,
        "amount": 2
      },
      {
        "ingredient": 19206,
        "amount": 2
      },
      {
        "ingredient": 1145,
        "amount": 4
      },
      {
        "ingredient": 1002030,
        "amount": 4
      },
      {
        "ingredient": 12061,
        "amount": 2
      },
      {
        "ingredient": 19335,
        "amount": 4
      },
      {
        "ingredient": 15152,
        "amount": 3
      },
      {
        "ingredient": 9003,
        "amount": 2
      },
      {
        "ingredient": 18372,
        "amount": 3
      },
      {
        "ingredient": 2027,
        "amount": 2
      }
    ];
    pantry = new Pantry(pantrySupply);
    greenHam = new Recipe({
      'id': 12283, 
      'img':'img', 
      'ingredients':[
        {id: 11477, quantity: {amount: 5}}, 
        {id: 11297, quantity: {amount: 4}}, 
        {id: 16069, quantity: {amount: 1}}
      ], 
      "name": "Grandma's Ham", 
      "tags": ["delicious", "terrifying"]
    });
    aPerfectEgg = new Recipe ({
      'id': 12283,
      'img': 'img',
      'ingredients': [
        { id: 20081, quantity: {amount: 5}},
        { id: 11215, quantity: {amount: 5}},
      ],
      "name": "A perfect egg",
      "tags": ["beautiful", "satisfying"]
    });
  });

  it('should be a function', () => {
    expect(Pantry).to.be.a('function');    
  });

  it('should hold a users ingredients', () => {
    expect(pantry.supplies).to.deep.equal(pantrySupply);
  });

  it('should only accept arrays as inputs', () => {
    badPantry = new Pantry('rotten eggs');
    expect(badPantry.supplies).to.deep.equal([]);
  });

  it('should only hold ingredients which are objects', () => {
    badPantry = new Pantry(['rotten eggs']);
    expect(badPantry.supplies).to.deep.equal([]);
  })

  it('it should only accept ingredients with a number value' +
  ' ingredient key', () => {
    badPantry = new Pantry([{ingredient:'rotten eggs'}]);
    expect(badPantry.supplies).to.deep.equal([]);
  });

  it('should only accept ingredients with ' + 
  'a number value amount key', () => {
    badPantry = new Pantry([{ ingredient: 123, amount: 'forty'}]);
    expect(badPantry.supplies).to.deep.equal([]);
  });

  it('it should be able to check if one ingredients "id" is ' + 
  'in another array of ingredients', () => {
    let isTrue = pantry.compareIngredients(pantrySupply[0], greenHam.requiredIngredients[0]);
    expect(isTrue).to.equal(true); 
  });
  
  it('can compareIngredient IDs whether or not they\'re assigned to ' +
  '.id or .ingredient', () => {
    let isTrue = pantry.compareIngredients(greenHam.requiredIngredients[0], pantrySupply[0]);
    expect(isTrue).to.equal(true); 
    })

  it('should determine which ingredients a pantry has for a given recipe', () => {
    const requiredIngredientsInPantry = pantry.checkPantryForRecipeIngredients(greenHam);
    const expectedIngredients = [
      { ingredient: 11477, amount: 4 },
      { ingredient: 11297, amount: 4 },
    ];
    expect(requiredIngredientsInPantry).to.deep.equal(expectedIngredients);
  });

  it('should only check ingredients if the given recipe is a RECIPE', () => {
    const requiredIngredientsInPantry = pantry.checkPantryForRecipeIngredients(
      'choppedLiver'
    );
    const expectedIngredients = 'This is not a recipe'
    expect(requiredIngredientsInPantry).to.deep.equal(expectedIngredients);
  });

  it('can find an ingredient\'s name from its Id', () => {
    let name = pantry.findIngredientName(16069);
    expect(name).to.equal('legumes');
  });

  it('won\'t search for IDs that aren\'t numbers', () => {
    let name = pantry.findIngredientName('legumes');
    expect(name).to.equal(undefined);
  })

  it('should know how many ingredients are needed to make a recipe', () => {
    let missingIngredients = pantry.showMissingIngredients(greenHam);
    expect(missingIngredients).to.equal('You still need 1 zucchini squash ' +
    'and 1 legumes to make Grandma\'s Ham')
  });

  it('won\'t check for missing ingredients if not provided with a recipe', () => {
    let missingIngredients = pantry.showMissingIngredients('rotten eggs');
    expect(missingIngredients).to.equal('This is not a recipe');
  })

  it('should know when a pantry has all the required ingredients', () => {
    let wellPreparedPantry = pantry.showMissingIngredients(aPerfectEgg);
    expect(wellPreparedPantry).to.equal('All the required ingredients are in the pantry');
  });

  it('should be able to use ingredients from the pantry', () => {
    pantry.useIngredients(aPerfectEgg);
    expect(pantry.supplies[3].amount).to.equal(0);
    expect(pantry.supplies[4].amount).to.equal(0);
  });
  
  it('should only be able to use ingredients if there are enough in pantry', () => {
    pantry.useIngredients(greenHam);
    expect(pantry.supplies[0].amount).to.equal(4);
    expect(pantry.supplies[1].amount).to.equal(4);
  });

  it('should be able to calculate the cost of the missing ingredients', () => {
    let cost = pantry.findIngredientsCost(greenHam);
    expect(cost).to.equal(7.42 + 9.03);
  });
});