const { it, expect, jest: globalJest } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

globalJest.mock('../../leebrary/assets/updateAsset');
globalJest.mock('../../permissions/assignables/users/getUserPermission');
globalJest.mock('../getAssignable');

const {
  getAssignableObject,
} = require('../../../__fixtures__/getAssignableObject');
const { publishAssignable } = require('./publishAssignable');

const {
  getUserPermission,
} = require('../../permissions/assignables/users/getUserPermission');
const { getAssignable } = require('../getAssignable');

it('Publishes the assignable', async () => {
  // Arrange
  const assignable = getAssignableObject();
  const id = 'assignable-id';
  const actions = {
    'common.versionControl.publishVersion': globalJest.fn(),
  };

  getAssignable.mockImplementation(() => assignable);
  getUserPermission.mockImplementation(() => ({ actions: ['view', 'edit'] }));

  const ctx = generateCtx({
    actions,
  });

  // Act
  const response = await publishAssignable({ id, ctx });

  // Assert
  expect(response).toBe(true);
  expect(actions['common.versionControl.publishVersion']).toHaveBeenCalledWith({
    id,
    publish: true,
    setAsCurrent: true,
  });
});

it('Throws an error if already published', async () => {
  const assignable = getAssignableObject();
  const id = 'assignable-id';

  getAssignable.mockImplementation(() => assignable);
  getUserPermission.mockImplementation(() => ({ actions: ['view', 'edit'] }));

  const actions = {
    'common.versionControl.publishVersion': () => {
      throw new Error('already published');
    },
  };

  const ctx = generateCtx({
    actions,
  });

  // Act
  const testFn = () => publishAssignable({ id, ctx });

  // Assert
  expect(testFn()).rejects.toThrowError(
    'Cannot publish assignable: already published'
  );
});

it('Throws an error if user lacks permissions', async () => {
  const assignable = getAssignableObject();
  const id = 'assignable-id';

  getAssignable.mockImplementation(() => assignable);
  getUserPermission.mockImplementation(() => ({ actions: ['view'] }));

  const actions = {
    'common.versionControl.publishVersion': globalJest.fn(),
  };

  const ctx = generateCtx({
    actions,
  });

  // Act
  const testFn = () => publishAssignable({ id, ctx });

  // Assert
  expect(testFn()).rejects.toThrowError('You do not have permissions');
  expect(actions['common.versionControl.publishVersion']).not.toBeCalled();
});

it('Throws an error if the assignable is soft-deleted', async () => {
  const assignable = getAssignableObject();
  const id = 'assignable-id';

  getAssignable.mockImplementation(() => ({ ...assignable, isDeleted: true }));
  getUserPermission.mockImplementation(() => ({ actions: ['view'] }));

  const actions = {
    'common.versionControl.publishVersion': globalJest.fn(),
  };

  const ctx = generateCtx({
    actions,
  });

  // Act
  const testFn = () => publishAssignable({ id, ctx });

  // Assert
  expect(testFn()).rejects.toThrowError(
    'Cannot publish assignable: The assignable is deleted'
  );
  expect(actions['common.versionControl.publishVersion']).not.toBeCalled();
});
