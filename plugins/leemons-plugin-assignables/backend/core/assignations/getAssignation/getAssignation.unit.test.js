const { it, expect } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { getAssignation } = require('./getAssignation');

jest.mock('../getAssignations');

const { getAssignations } = require('../getAssignations');

it('Should get an assignation', async () => {
  // Arrange
  const assignableInstanceId = 'assignable-instance-id';
  const user = 'user-id';
  const ctx = generateCtx({});

  getAssignations.mockImplementation(() => [{ id: 'assignationId' }]);

  // Act
  const result = await getAssignation({ assignableInstanceId, user, ctx });

  // Assert
  expect(result).toBeDefined();
  expect(result.id).toEqual('assignationId');
});
