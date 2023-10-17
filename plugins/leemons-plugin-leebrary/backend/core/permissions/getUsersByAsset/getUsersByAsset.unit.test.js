const {
  it,
  expect,
  jest: { fn },
} = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');
const { LeemonsError } = require('@leemons/error');

const { getUsersByAsset } = require('./getUsersByAsset');
const { permissionSeparator } = require('../../../config/constants');

// MOCKS
jest.mock('../getByAsset');
const { getByAsset } = require('../getByAsset');

it('Should call getUsersByAsset correctly', async () => {
  // Arrange
  const action = fn(() => 'actionReturnValue');

  const ctx = generateCtx({
    actions: {
      'users.permissions.findUsersWithPermissions': action,
    },
  });

  getByAsset.mockResolvedValue({ permissions: { view: true } });
  // Act
  const response = await getUsersByAsset({ assetId: 'assetOne', ctx });

  // Assert
  expect(action).toBeCalledWith({
    permissions: { permissionName: ctx.prefixPN(`${permissionSeparator}assetOne`) },
  });
  expect(response).toBe('actionReturnValue');
});

it('Should throw a LeemonsError with code 401 when user does not have view permission', async () => {
  // Arrange
  const ctx = generateCtx({});
  getByAsset.mockResolvedValue({ permissions: { view: false } });

  // Act & Assert
  try {
    await getUsersByAsset({ assetId: 'assetOne', ctx });
  } catch (error) {
    expect(error).toBeInstanceOf(LeemonsError);
    expect(error.message).toBe(
      "Failed to get permissions: You don't have permission to list users"
    );
    expect(error.httpStatusCode).toBe(401);
  }
});

it('Should throw a LeemonsError with code 500 when an error occurs in the try block', async () => {
  // Arrange
  const ctx = generateCtx({});
  const errorMsg = 'Some error';
  getByAsset.mockImplementation(() => {
    throw new Error(errorMsg);
  });

  // Act & Assert
  try {
    await getUsersByAsset({ assetId: 'assetOne', ctx });
  } catch (error) {
    expect(error).toBeInstanceOf(LeemonsError);
    expect(error.message).toBe(`Failed to get permissions: ${errorMsg}`);
    expect(error.httpStatusCode).toBe(500);
  }
});
