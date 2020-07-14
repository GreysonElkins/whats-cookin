const chai = require('chai');
const expect = chai.expect;
const scripts = require('../src/scripts');
const ingredientsData = require('../data/ingredients')

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
  })
});