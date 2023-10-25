const { it, expect, jest: globalJest } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

globalJest.mock('../getAssignables');

const { getAssignable } = require('./getAssignable');

const { getAssignables } = require('../getAssignables');

it('Calls getAssignables and returns the first item', async () => {
  // Arrange
  const id = 'assignable-id';

  const ctx = generateCtx({});

  getAssignables.mockImplementation(() => ['First value']);

  // Act
  const response = await getAssignable({
    id,
    showDeleted: false,
    withFiles: true,
    ctx,
  });

  // Assert
  expect(getAssignables).toBeCalledWith(
    expect.objectContaining({
      ids: expect.arrayContaining([id]),
      showDeleted: false,
      withFiles: true,
    })
  );
  expect(response).toBe(getAssignables()[0]);
});

it('Catches the getAssignables error and creates a new one', async () => {
  // Arrange
  const id = 'assignable-id';

  const ctx = generateCtx({});

  getAssignables.mockImplementation(() => {
    throw new Error('This error should be masked');
  });

  // Act
  const testFn = () => getAssignable({ id, ctx });

  // Assert
  await expect(testFn()).rejects.toThrowError(
    `The assignable ${id} does not exist or you don't have access to it.`
  );
});
