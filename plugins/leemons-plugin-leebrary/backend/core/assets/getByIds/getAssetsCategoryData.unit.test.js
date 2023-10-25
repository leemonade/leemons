const {
  it,
  expect,
  jest: { fn },
} = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { getAssetsCategoryData } = require('./getAssetsCategoryData');
const getCategory = require('../../../__fixtures__/getCategory');

// MOCKS
jest.mock('../../categories/getByIds');
jest.mock('../../providers/getByNames');
const { getByIds: getCategories } = require('../../categories/getByIds');
const { getByNames: getProviderByNames } = require('../../providers/getByNames');

const { categoryObject } = getCategory();

it('Should correctly fetch category data associated with each asset passed', async () => {
  // Arrange
  const assets = [
    { id: 'assetOneId', category: 'categoryOne' },
    { id: 'assetTwoId', category: 'categoryTwo' },
    { id: 'assetTwoId', category: 'categoryThree' },
  ];
  const categories = [
    { ...categoryObject, id: assets[0].category },
    { ...categoryObject, id: assets[1].category, provider: 'providerOne' },
    { ...categoryObject, id: assets[2].category, provider: 'providerTwo' },
  ];
  const providers = [
    { pluginName: 'providerOne', supportedMethods: { getByIds: true }, image: null },
    { pluginName: 'providerTwo', supportedMethods: { getByIds: false }, image: null },
  ];
  const providerAction = fn(() => ['result']);
  const ctx = generateCtx({
    actions: {
      'providerOne.assets.getByIds': providerAction,
    },
  });

  getCategories.mockResolvedValue(categories);
  getProviderByNames.mockResolvedValue(providers);

  const expectedResult = [categories, [null, 'result', null]];

  // Act
  const response = await getAssetsCategoryData({ assets, ctx });

  // Assert
  expect(getCategories).toBeCalledWith({
    categoriesIds: assets.map((asset) => asset.category),
    ctx,
  });
  expect(getProviderByNames).toBeCalledWith({
    names: [categories[1].provider, categories[2].provider],
    ctx,
  });
  expect(providerAction).toBeCalledWith({ assetIds: [assets[1].id] });
  expect(response).toEqual(expectedResult);
});
