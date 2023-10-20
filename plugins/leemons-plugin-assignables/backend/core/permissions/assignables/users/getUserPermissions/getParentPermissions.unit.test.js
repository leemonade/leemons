const { it, expect, beforeEach } = require('@jest/globals');

const { generateCtx } = require('@leemons/testing');

const { getParentPermissions } = require('./getParentPermissions');

const { getParentAssignables } = require('./getParentAssignables');

jest.mock('./getParentAssignables');

const getAllItemsForTheUserAgentHasPermissionsByTypeHandler = jest.fn();

describe('getParentPermissions', () => {
  let ctx;

  beforeEach(() => {
    jest.clearAllMocks();
    ctx = generateCtx({
      actions: {
        'users.permissions.getAllItemsForTheUserAgentHasPermissionsByType':
          getAllItemsForTheUserAgentHasPermissionsByTypeHandler,
      },
    });
  });

  // Arrange
  const assignableIds = ['assignableId1'];

  it('should return the correct permissions', async () => {
    // Arrange
    getParentAssignables.mockResolvedValue({
      assetId1: [
        {
          asset: 'assetId1',
          activity: 'b82cf6dd-5ef0-41fa-a4c1-930d34a46eba@2.0.0',
        },
        {
          asset: 'assetId1',
          activity: '19446d61-ec54-4222-a383-1a9a52e04d9f@2.0.0',
        },
      ],
    });
    getAllItemsForTheUserAgentHasPermissionsByTypeHandler.mockResolvedValue([
      'assetId1',
    ]);

    // Act
    const response = await getParentPermissions({ ids: assignableIds, ctx });

    // Assert
    expect(getParentAssignables).toBeCalledWith({
      ids: assignableIds,
      ctx,
    });
    expect(
      getAllItemsForTheUserAgentHasPermissionsByTypeHandler
    ).toBeCalledWith({
      userAgentId: ctx.meta.userSession.userAgents.map((el) => el.id),
      type: 'leebrary.asset.can-assign',
      ignoreOriginalTarget: true,
      item: ['assetId1'],
    });
    expect(response).toEqual([
      ['b82cf6dd-5ef0-41fa-a4c1-930d34a46eba@2.0.0', ['view']],
      ['19446d61-ec54-4222-a383-1a9a52e04d9f@2.0.0', ['view']],
    ]);
  });

  it('should return an empty array if no permissions are found', async () => {
    // Arrange
    const ids = ['non-existent-id'];

    getAllItemsForTheUserAgentHasPermissionsByTypeHandler.mockResolvedValue([]);

    // Act
    const response = await getParentPermissions({ ids, ctx });

    // Assert
    expect(response).toEqual([]);
  });
});
