const { it, expect, beforeEach } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');
const { LeemonsError } = require('@leemons/error');

const { getByFile } = require('./getByFile');
const getAssets = require('../../../../__fixtures__/getAssets');

// MOCKS
jest.mock('./getRelatedAssets');
jest.mock('./handleIsPublic');
jest.mock('./handleUserPermissions');
const { getRelatedAssets } = require('./getRelatedAssets');
const { handleIsPublic } = require('./handleIsPublic');
const { handleUserPermissions } = require('./handleUserPermissions');

beforeEach(() => jest.resetAllMocks());
const { assetModel } = getAssets();

it("Should get the asset related to a file by the file's id accordingly to checkPermissions and public flags", async () => {
  // Arrange
  const ctx = generateCtx({});
  const relatedAssets = [assetModel.id];
  const fileId = 'fileId';

  getRelatedAssets.mockResolvedValue(relatedAssets);
  handleIsPublic.mockResolvedValue(true);
  handleUserPermissions.mockResolvedValue(true);

  // Act
  const responseDefault = await getByFile({ fileId, ctx });
  const responseNoPermissions = await getByFile({ fileId, checkPermissions: false, ctx });
  const responseOnlyPublic = await getByFile({
    fileId,
    checkPermissions: false,
    onlyPublic: true,
    ctx,
  });

  // Assert
  expect(getRelatedAssets).nthCalledWith(1, { fileId, ctx });
  expect(getRelatedAssets).nthCalledWith(2, { fileId, ctx });
  expect(getRelatedAssets).nthCalledWith(3, { fileId, ctx });
  expect(handleUserPermissions).toBeCalledWith({ assetId: assetModel.id, ctx });
  expect(handleUserPermissions).toBeCalledTimes(1);
  expect(handleIsPublic).toBeCalledWith({ assetId: assetModel.id, ctx });
  expect(handleIsPublic).toBeCalledTimes(1);
  expect(responseDefault).toEqual(assetModel.id);
  expect(responseNoPermissions).toEqual(assetModel.id);
  expect(responseOnlyPublic).toEqual(assetModel.id);
});

it('Should return null when the asset is not public and the onlyPublic flag is true', async () => {
  // Arrange
  const ctx = generateCtx({});
  const relatedAssets = [assetModel.id];
  const fileId = 'fileId';

  getRelatedAssets.mockResolvedValue(relatedAssets);
  handleIsPublic.mockResolvedValue(false);
  handleUserPermissions.mockResolvedValue(true);

  // Act
  const response = await getByFile({ fileId, onlyPublic: true, ctx });

  // Assert
  expect(response).toBeNull();
});

it('Should return null when the user does not have permissions to view the asset and the permissions flag is true', async () => {
  // Arrange
  const ctx = generateCtx({});
  const relatedAssets = [assetModel.id];
  const fileId = 'fileId';

  getRelatedAssets.mockResolvedValue(relatedAssets);
  handleIsPublic.mockResolvedValue(true);
  handleUserPermissions.mockResolvedValue(false);

  // Act
  const response = await getByFile({ fileId, checkPermissions: true, ctx });

  // Assert
  expect(response).toBeNull();
});

it('Should throw a LeemonsError with a 500 HTTP code when an error occurs', async () => {
  // Arrange
  const ctx = generateCtx({});
  const relatedAssets = [assetModel.id];
  const fileId = 'fileId';
  const errorMessages = [
    'Cannot determine if the user has permission to view.',
    'Cannot determine if the asset is public.',
  ];

  getRelatedAssets.mockResolvedValue(relatedAssets);
  handleUserPermissions.mockImplementation(() => {
    throw new Error(errorMessages[0]);
  });
  handleIsPublic.mockImplementation(() => {
    throw new Error(errorMessages[1]);
  });

  // Act
  const fnFailsAtPermissionsCheck = async () => getByFile({ fileId, ctx });
  const fnFailsAtOnlyPublicCheck = async () => getByFile({ fileId, onlyPublic: true, ctx });

  // Assert
  try {
    await fnFailsAtPermissionsCheck();
  } catch (error) {
    expect(error).toBeInstanceOf(LeemonsError);
    expect(error.httpStatusCode).toBe(500);
    expect(error.message).toBe(`Failed to get files: ${errorMessages[0]}`);
  }

  try {
    await fnFailsAtOnlyPublicCheck();
  } catch (error) {
    expect(error).toBeInstanceOf(LeemonsError);
    expect(error.httpStatusCode).toBe(500);
    expect(error.message).toBe(`Failed to get files: ${errorMessages[1]}`);
  }
});
