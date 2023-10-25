const { it, expect } = require('@jest/globals');

const { getInstanceGroup } = require('./getInstanceGroup');

const { getInstanceObject } = require('../../../__fixtures__/getInstanceObject');

it('Should return group if instance has not related instances', async () => {
  // Arrange

  const instance = {
    ...getInstanceObject(),
    relatedAssignableInstances: {},
  };

  const expectedResponse = [instance];

  // Act
  const response = getInstanceGroup(instance, {
    [instance.id]: instance,
  });

  // Assert
  expect(response).toEqual(expectedResponse);
});

it('Should return group if instance has related instances', async () => {
  // Arrange
  const afterInstance = {
    ...getInstanceObject(),
    id: 'afterInstanceId1',
  };
  const instance = {
    ...getInstanceObject(),
    relatedAssignableInstances: {
      after: [afterInstance],
    },
  };

  const expectedResponse = [instance, afterInstance];

  // Act
  const response = getInstanceGroup(instance, {
    [instance.id]: instance,
    [afterInstance.id]: afterInstance,
  });

  // Assert
  expect(response).toEqual(expectedResponse);
});

it('Should return null if instance is null', async () => {
  // Arrange

  // Act
  const response = await getInstanceGroup(null, {});

  // Assert
  expect(response).toBeNull();
});
