const { it, expect, beforeEach } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');
const { LeemonsError } = require('@leemons/error');

const { unlink } = require('./unlink');

// MOCKS
jest.mock('./handleUserPermissions');
jest.mock('../remove');
const { handleUserPermissions } = require('./handleUserPermissions');
const { remove } = require('../remove');

beforeEach(() => jest.resetAllMocks());

it('Should unlink files from an asset only when the user is allowed to delete the asset', async () => {
  // Arrange
  const assetId = 'assetId';
  const fileIds = ['file1', 'file2'];
  const soft = true;
  const ctx = generateCtx({});
  const removeResponse = true;

  handleUserPermissions.mockResolvedValue(true);
  remove.mockResolvedValue(removeResponse);

  // Act
  const response = await unlink({ fileIds, assetId, soft, ctx });
  await unlink({ fileIds, assetId, ctx });
  // Assert
  expect(handleUserPermissions).toBeCalledWith({ assetId, ctx });
  expect(remove).nthCalledWith(1, { fileIds, assetId, soft, ctx });
  expect(remove).nthCalledWith(2, { fileIds, assetId, soft: undefined, ctx });
  expect(response).toBe(removeResponse);
});

it('Should throw a Leemons error if the user is not authorized to delete the asset or if anything else goes wrong', async () => {
  // Arrange
  const assetId = 'assetId';
  const fileIds = ['file1', 'file2'];
  const ctx = generateCtx({});
  const errorMessages = [
    "You don't have permissions to delete this asset",
    'Something went wrong while removing the file',
  ];

  remove.mockImplementation(() => {
    throw new Error(errorMessages[1]);
  });

  // Act
  const testFnUnauthorizedUser = async () => unlink({ fileIds, assetId, ctx });
  const testFnRemoveThrows = async () => unlink({ fileIds, assetId, ctx });

  // Assert
  try {
    handleUserPermissions.mockResolvedValue(false);
    await testFnUnauthorizedUser();
  } catch (error) {
    expect(error).toBeInstanceOf(LeemonsError);
    expect(error.httpStatusCode).toBe(401);
    expect(error.message).toBe(`Failed to delete file: ${errorMessages[0]}`);
  }

  try {
    handleUserPermissions.mockResolvedValue(true);
    await testFnRemoveThrows();
  } catch (error) {
    expect(error).toBeInstanceOf(LeemonsError);
    expect(error.httpStatusCode).toBe(500);
    expect(error.message).toBe(`Failed to delete file: ${errorMessages[1]}`);
  }
});
