function createId(data) {
    return typeof data === 'number' ? data : Date.now();
}

function checkModule(send) {
  if (typeof module !== 'undefined') {
   module.exports = send;
  }
}



function generateReadableIngredientList(ingredientList, recipe)  {
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
// why doesn't this send a class?

if (typeof module !== 'undefined') {
  module.exports = {createId, checkModule}
}