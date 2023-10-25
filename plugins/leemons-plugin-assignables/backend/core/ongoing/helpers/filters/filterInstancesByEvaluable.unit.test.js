const { it, expect } = require('@jest/globals');
const { filterInstancesByEvaluable } = require('./filterInstancesByEvaluable');

it('Should call filterInstancesByEvaluable correctly when evaluable is true', () => {
  // Arrange
  const instanceOne = {
    id: 'instanceOne',
    requiresScoring: true,
    allowFeedback: true,
  };
  const instanceTwo = {
    id: 'instanceTwo',
    requiresScoring: false,
    allowFeedback: false,
  };
  const evaluable = true;

  // Act
  const response = filterInstancesByEvaluable({
    instances: [instanceOne, instanceTwo],
    evaluable,
  });

  // Assert
  expect(response).toEqual([instanceOne]);
});
