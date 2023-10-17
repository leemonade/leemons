const { it, expect } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');
const { getAssignationsData } = require('./getAssignationsData');
const {
  getAssignationsOfInstance,
} = require('../../assignations/getAssignationsOfInstance');

jest.mock('../../assignations/getAssignationsOfInstance');

it('Should get assignations data', async () => {
  // Arrange
  const ctx = generateCtx({});
  const instances = ['instance1', 'instance2'];
  const instancesTeached = { instance1: true, instance2: false };
  const expectedData = {
    instance1: [{ user: 'student1' }, { user: 'student2' }],
  };

  getAssignationsOfInstance.mockReturnValue(expectedData);

  // Act
  const response = await getAssignationsData({
    instances,
    instancesTeached,
    ctx,
  });

  // Assert
  expect(getAssignationsOfInstance).toBeCalledWith({
    instances: ['instance1'],
    details: true,
    ctx,
  });
  expect(response).toEqual(expectedData);
});
