const { it, expect } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { handleSorting } = require('./handleSorting');
const getUserSession = require('../../../__fixtures__/getUserSession');

// MOCKS
jest.mock('../../assets/getByIds');
jest.mock('../getByAssets/getByAssets');
const { getByIds } = require('../../assets/getByIds');
const { getByAssets } = require('../getByAssets/getByAssets');

const userSession = getUserSession();

it('Should return permissions by asset sorted by a specific asset parameter ', async () => {
  // Arrange
  const assetOne = { id: 'idAaa' };
  const assetTwo = { id: 'idMaa' };
  const assetThree = { id: 'idZzz' };
  const params = {
    assetIds: [assetThree.id, assetOne.id, assetTwo.id],
    indexable: true,
    showPublic: false,
    sortingBy: 'id',
    sortDirection: 'asc',
  };
  const assetsAccessibles = [
    { asset: assetTwo.id, role: 'editor', permissions: {} },
    { asset: assetOne.id, role: 'owner', permissions: {} },
    { asset: assetThree.id, role: 'viewer', permissions: {} },
  ];

  const expectedResponse = assetsAccessibles.sort((a, b) => a.asset.localeCompare(b.asset));

  const ctx = generateCtx({});
  ctx.meta.userSession = { ...userSession };

  getByIds.mockResolvedValue([assetThree, assetOne, assetTwo]);
  getByAssets.mockResolvedValue(assetsAccessibles);

  // Act
  const response = await handleSorting({ ...params, ctx });
  const descResponse = await handleSorting({ ...params, sortDirection: 'desc', ctx });

  // Assert
  expect(response).toEqual(expectedResponse);
  expect(descResponse).toEqual(expectedResponse.reverse());
});
