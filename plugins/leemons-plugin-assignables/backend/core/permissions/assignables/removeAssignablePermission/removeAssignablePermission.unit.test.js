const { it, expect, jest: globalJest } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { removeAssignablePermission } = require('./removeAssignablePermission');
const { getPermissionType } = require('../helpers/getPermissionType');
const { getPermissionName } = require('../helpers/getPermissionName');

it('Should remove the given permission', async () => {
  // Arrange
  const id = 'permission-id';
  const role = 'permission-role';

  const actions = {
    'users.permissions.removeItems': globalJest.fn(),
  };
  const ctx = generateCtx({ actions });

  // Act
  await removeAssignablePermission({ id, role, ctx });

  // Assert
  expect(actions['users.permissions.removeItems']).toBeCalledWith({
    query: {
      type: getPermissionType({ role, ctx }),
      permissionName: getPermissionName({ id, ctx }),
    },
  });
});

it('Should throw if required params are not provided', async () => {
  // Arrange
  const id = 'permission-id';
  const role = 'permission-role';

  const actions = {
    'users.permissions.removeItems': globalJest.fn(),
  };
  const ctx = generateCtx({ actions });

  // Act
  const noIdFn = () => removeAssignablePermission({ id: undefined, role, ctx });
  const noRoleFn = () =>
    removeAssignablePermission({ id, role: undefined, ctx });

  // Assert
  await expect(noIdFn).rejects.toThrowError(
    'Cannot remove assignable permission: id and role are required'
  );
  await expect(noRoleFn).rejects.toThrowError(
    'Cannot remove assignable permission: id and role are required'
  );
});

it('Should handle internal function error', async () => {
  // Arrange
  const id = 'permission-id';
  const role = 'permission-role';
  const error = 'This is an error which should be catched';

  const actions = {
    'users.permissions.removeItems': () => {
      throw new Error(error);
    },
  };
  const ctx = generateCtx({ actions });

  // Act
  const testFn = () => removeAssignablePermission({ id, role, ctx });

  // Assert
  await expect(testFn).rejects.toThrowError(
    `Error removing permission: ${error}`
  );
});
