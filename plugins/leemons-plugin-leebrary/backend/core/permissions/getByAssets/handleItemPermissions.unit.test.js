const {
  it,
  expect,
  jest: { fn },
} = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { handleItemPermissions } = require('./handleItemPermissions');

it('Should call handleItemPermissions correctly', async () => {
  // Arrange
  const assetsIds = ['assetOne', 'assetTwo'];
  const mockResolvedValue = 'value';
  const permissionTypes = {
    view: 'asset.can-view',
    edit: 'asset.can-edit',
    assign: 'asset.can-assign',
  };
  const userAgents = ['userAgentOne'];
  const getAllItemsForTheUserAgentHasPermissionsByType = fn().mockResolvedValue(mockResolvedValue);
  const ctx = generateCtx({
    actions: {
      'users.permissions.getAllItemsForTheUserAgentHasPermissionsByType':
        getAllItemsForTheUserAgentHasPermissionsByType,
    },
  });

  // Act
  const response = await handleItemPermissions({ assetsIds, userAgents, ctx });

  // Assert
  Object.keys(permissionTypes).forEach((type, i) => {
    expect(getAllItemsForTheUserAgentHasPermissionsByType).nthCalledWith(i + 1, {
      userAgentId: userAgents,
      type: ctx.prefixPN(permissionTypes[type]),
      ignoreOriginalTarget: true,
      item: assetsIds,
    });
  });
  expect(response).toEqual(new Array(Object.keys(permissionTypes).length).fill(mockResolvedValue));
});
