const { it, expect } = require('@jest/globals');
const { getAssignationStatus } = require('./getAssignationStatus');

it('Should return assignation status', async () => {
    var current = new Date();
  // Arrange
  const dates = {
    close: new Date(current.getTime() + 86400000), // today + 1 day
    closed: new Date()
  };
  const timestamps = {
   
  };

  // Act
  const result = getAssignationStatus({ dates, timestamps });

  // Assert
  expect(result).toBeDefined();
  expect(result).toHaveProperty('finished');
  expect(result).toHaveProperty('started');
  expect(result.finished).toEqual(true);
  expect(result.started).toEqual(true);
});

it('Should return assignation status not start', async () => {
    var current = new Date();
    // Arrange
    const dates = {
        start: new Date(current.getTime() + 86400000), // today + 1 day
        deadline: new Date(current.getTime() + 86400000 * 2), // today + 2 day
    };
    const timestamps = {
    };
  
    // Act
    const result = getAssignationStatus({ dates, timestamps });

  
    // Assert
    expect(result).toBeDefined();
    expect(result).toHaveProperty('finished');
    expect(result).toHaveProperty('started');
    expect(result.finished).toEqual(false);
    expect(result.started).toEqual(false);
  });
