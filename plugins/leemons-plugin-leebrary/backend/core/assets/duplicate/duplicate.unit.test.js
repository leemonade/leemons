const { it, expect } = require('@jest/globals');
const { generateCtx } = require('leemons-testing');

const { duplicate } = require('./duplicate');
const getAssets = require('../../../__fixtures__/getAssets');
const getAssetsAddDataInput = require('../../../__fixtures__/getAssetAddDataInput');
const getUserSession = require('../../../__fixtures__/getUserSession');
const getCategory = require('../../../__fixtures__/getCategory');

// MOCKS
jest.mock('./checkDuplicatePermissions');
jest.mock('./getAndCheckAsset.js');
jest.mock('../../categories/checkDuplicable');
const { checkDuplicatePermissions } = require('./checkDuplicatePermissions');
const { getAndCheckAsset } = require('./getAndCheckAsset');
const { checkDuplicable: checkCategoryDuplicable } = require('../../categories/checkDuplicable');
const { getFileIds } = require('./getFileIds');

const inputBookmark = {
  assetId: 'fullId@1.0.0', // the asset's full id
  indexable: undefined,
  newId: undefined,
  preserveName: false, // defaults to false
  public: undefined,
};

const { bookmarkAsset } = getAssets();
const { dataInput: addDataInput } = getAssetsAddDataInput();
const { categoryObject } = getCategory();

it('Should correctly duplicate a bookmark asset', () => {
  // Arrange
  const asset = { ...bookmarkAsset, cover: bookmarkAsset.cover.id };
  const expectedResponse = {
    ...bookmarkAsset,
    fileType: 'bookmark',
    icon: addDataInput.icon,
    id: 'nuevoId@1.0.0',
    metadata: [],
    url: addDataInput.url,
  };

  const ctx = generateCtx({
    actions: {
      // 'plugin.service.action': () => expectedValue,
    },
  });
  ctx.meta.userSession = getUserSession();

  getAndCheckAsset.mockResolvedValue({ ...asset });
  checkCategoryDuplicable.mockResolvedValue({ ...categoryObject });
  getFileIds.mockResolvedValue([asset.cover]); // empty array for a bookmark

  // Act
  // const response = duplicate({ assetId: bookmarkAsset.id, ctx });

  // Assert
  // expect(checkDuplicatePermissions).toBeCalledWith({
  //   assetId: bookmarkAsset.id,
  //   ctx,
  // });
  // expect(getAndCheckAsset).toBeCalledWith({ assetId: bookmarkAsset.id, ctx });
  // expect(checkCategoryDuplicable).toBeCalledWith({
  //   categoryId: bookmarkAsset.category,
  //   ctx,
  // });
  // expect(getFileIds).toBeCalledWith({ asset: { ...asset }, ctx });

  // expect(response).toBe(expectedResponse);
});
