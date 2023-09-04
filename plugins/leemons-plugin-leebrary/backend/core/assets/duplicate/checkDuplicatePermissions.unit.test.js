const { it, expect, afterEach } = require('@jest/globals');
const { generateCtx } = require('leemons-testing');
const { LeemonsError } = require('leemons-error');

const { checkDuplicatePermissions } = require('./checkDuplicatePermissions');

jest.mock('../../permissions/getByAsset');
const { getByAsset: getPermissions } = require('../../permissions/getByAsset');

const mockedPermissions = {
  view: true,
  assign: true,
  comment: true,
  edit: true,
  delete: true,
  duplicate: true,
  canAssign: ['assigner', 'viewer', 'commentor', 'editor', 'owner'],
  canUnassign: ['assigner', 'viewer', 'commentor', 'editor'],
};

afterEach(() => jest.resetAllMocks());

it('calls getPermissions correctly and throws a LeemonsError if the user it not allowed to duplicate the asset', async () => {
  // Arrange
  const assetId = 'anAssetId@1.0.0';
  getPermissions.mockResolvedValue({ permissions: { duplicate: false } });

  const ctx = generateCtx({});

  // Act
  const testFnNoDupPermission = async () => checkDuplicatePermissions({ assetId, ctx });
  const testWithDupPermission = async () => checkDuplicatePermissions({ assetId, ctx });

  // Assert
  await expect(testFnNoDupPermission).rejects.toThrowError(LeemonsError);
  expect(getPermissions).nthCalledWith(1, { assetId, ctx });

  getPermissions.mockResolvedValue({ permissions: { duplicate: true } });
  await expect(testWithDupPermission()).resolves.toBe(true);
  expect(getPermissions).nthCalledWith(2, { assetId, ctx });
});

it('Throws when the system cannot determine if the user has permission to duplicate the asset', async () => {
  // Arrange
  const assetId = 'anAssetId@1.0.0';
  getPermissions.mockResolvedValue(undefined);

  const ctx = generateCtx({});

  // Act
  const testWrongResponse = async () => checkDuplicatePermissions({ assetId, ctx });

  // Assert
  expect(testWrongResponse).rejects.toThrow();
});
