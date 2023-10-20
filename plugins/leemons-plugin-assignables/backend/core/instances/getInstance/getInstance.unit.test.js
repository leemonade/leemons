const { it, expect } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');
const { getInstance } = require('./getInstance');
const { getInstances } = require('../getInstances');

jest.mock('../getInstances');

it('Should get instance successfully', async () => {
  // Arrange
  const ctx = generateCtx({});
  const id = 'instanceId';
  const relatedAssignableInstances = true;
  const details = true;

  const instance = { id: 'instanceId', name: 'Instance Name' };
  getInstances.mockReturnValue([instance]);

  // Act
  const response = await getInstance({
    id,
    relatedAssignableInstances,
    details,
    ctx,
  });

  // Assert
  expect(response).toEqual(instance);
});

it('Should throw error when getInstances fails', async () => {
  // Arrange
  const ctx = generateCtx({});
  const id = 'instanceId';
  const relatedAssignableInstances = true;
  const details = true;

  const errorMessage = 'Error Message';
  getInstances.mockImplementation(() => {
    throw Error(errorMessage);
  });

  // Act
  const testFunc = () =>
    getInstance({ id, relatedAssignableInstances, details, ctx });

  // Assert
  await expect(testFunc).rejects.toThrow(errorMessage);
});
