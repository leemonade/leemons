const { it, expect } = require('@jest/globals');

const { getInstancesStatus } = require('./getInstancesStatus');

it('Should return "scheduled" for instances that are not always available and have not started', () => {
  // Arrange
  const instances = [
    {
      id: 'instancesOneId',
      alwaysAvailable: 0,
      dates: { start: new Date('December 31, 2099') },
    },
  ];

  // Act
  const response = getInstancesStatus(instances);

  // Assert
  expect(response).toEqual(['scheduled']);
});

it('Should return "closed" for started instances that have met their deadline', () => {
  // Arrange
  const instances = [
    {
      id: 'instancesOneId',
      alwaysAvailable: 0,
      dates: { start: new Date('October 31, 1993'), deadline: new Date('December 31, 1993') },
    },
  ];

  // Act
  const response = getInstancesStatus(instances);

  // Assert
  expect(response).toEqual(['closed']);
});

it('Should return "open" for instances that are always available', () => {
  // Arrange
  const instances = [
    {
      id: 'instancesOneId',
      alwaysAvailable: 1,
    },
  ];

  // Act
  const response = getInstancesStatus(instances);

  // Assert
  expect(response).toEqual(['open']);
});

it('Should return "closed" for instances that have a closed date even if they are always available', () => {
  // Arrange
  const instances = [
    {
      id: 'instancesOneId',
      alwaysAvailable: 1,
      dates: { closed: new Date('October 31, 1993') },
    },
  ];

  // Act
  const response = getInstancesStatus(instances);

  // Assert
  expect(response).toEqual(['closed']);
});
