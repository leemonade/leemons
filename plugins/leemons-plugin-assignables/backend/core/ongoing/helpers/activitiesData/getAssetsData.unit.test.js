const {
  it,
  expect,
  jest: { fn },
} = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { getAssetsData } = require('./getAssetsData');

it('Should correctly get assignable data without duplications', async () => {
  // Arrange
  const assets = ['assetIdOne', 'assetIdTwo', 'assetIdOne'];
  const mockAssets = [
    { id: assets[0], name: 'Asset One' },
    { id: assets[1], name: 'Asset Two' },
  ];
  const getByIdsAction = fn().mockResolvedValue(mockAssets);

  const ctx = generateCtx({
    actions: {
      'leebrary.assets.getByIds': getByIdsAction,
    },
  });

  const expectedResponse = {
    [assets[0]]: mockAssets[0],
    [assets[1]]: mockAssets[1],
  };
  // Act
  const response = await getAssetsData({ assets, ctx });

  // Assert
  expect(getByIdsAction).toBeCalledWith({
    ids: assets.slice(0, -1),
    withTags: false,
    withCategory: false,
    checkPins: false,
    showPublic: true,
  });
  expect(response).toEqual(expectedResponse);
});
