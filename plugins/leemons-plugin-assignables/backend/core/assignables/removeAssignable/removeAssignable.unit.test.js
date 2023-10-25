const { it, expect, jest: globalJest } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

globalJest.mock('../removeAssignables', () => ({
  removeAssignables: globalJest.fn(() => 'removeAssignablesCount'),
}));

const { removeAssignable } = require('./removeAssignable');

const { removeAssignables } = require('../removeAssignables');

const ids = ['assignable@1.0.0', 'assignable@2.0.0'];

const actions = {
  'common.versionControl.getVersion': ({ id }) => ({
    fullId: id,
    published: id === ids[0],
  }),
  'common.versionControl.listVersions': ({ published }) =>
    [
      {
        fullId: ids[0],
        published: true,
      },
      {
        fullId: ids[1],
        published: false,
      },
    ].filter(({ published: isPublished }) => {
      if (published === 'all') {
        return true;
      }

      return isPublished === !!published;
    }),
};

it('Removes the assignable version', async () => {
  // Arrange
  const id = ids[0];

  const ctx = generateCtx({
    actions,
  });

  // Act
  const response = await removeAssignable({
    assignable: id,
    removeAll: 0,
    ctx,
  });

  // Assert
  expect(response).toHaveProperty('count', 'removeAssignablesCount');
  expect(response).toHaveProperty('versions', [id]);
  expect(removeAssignables).toHaveBeenCalledWith(
    expect.objectContaining({ ids: [id] })
  );
});

it('Removes all versions of the assignable', async () => {
  // Arrange
  const id = ids[0];

  const ctx = generateCtx({
    actions,
  });

  // Act
  const response = await removeAssignable({
    assignable: id,
    removeAll: 2,
    ctx,
  });

  // Assert
  expect(response).toHaveProperty('count', 'removeAssignablesCount');
  expect(response).toHaveProperty('versions', expect.arrayContaining(ids));
  expect(removeAssignables).toHaveBeenCalledWith(
    expect.objectContaining({ ids: expect.arrayContaining(ids) })
  );
});

it('Removes only the same publish state versions of the assignable', async () => {
  // Arrange
  const id = ids[0];

  const ctx = generateCtx({
    actions,
  });

  // Act
  const response = await removeAssignable({
    assignable: id,
    removeAll: 1,
    ctx,
  });

  // Assert
  expect(response).toHaveProperty('count', 'removeAssignablesCount');
  expect(response).toHaveProperty('versions', [id]);
  expect(removeAssignables).toHaveBeenCalledWith(
    expect.objectContaining({ ids: [id] })
  );
});

it('Throws an error if no valid removeAll param is provided', async () => {
  // Arrange
  const id = ids[0];

  const ctx = generateCtx({
    actions,
  });

  // Act
  const testFn = () => removeAssignable({ assignable: id, removeAll: 25, ctx });

  // Assert
  await expect(testFn()).rejects.toThrowError(
    'Cannot remove assignable: invalid removeAll value, only 0, 1 or 2 are valid'
  );
});

it('Used removeAll = 2 when not provided', async () => {
  // Arrange
  const id = ids[0];

  const ctx = generateCtx({
    actions,
  });

  // Act
  const response = await removeAssignable({ assignable: id, ctx });

  // Assert
  expect(response).toHaveProperty('count', 'removeAssignablesCount');
  expect(response).toHaveProperty('versions', expect.arrayContaining(ids));
  expect(removeAssignables).toHaveBeenCalledWith(
    expect.objectContaining({ ids: expect.arrayContaining(ids) })
  );
});
