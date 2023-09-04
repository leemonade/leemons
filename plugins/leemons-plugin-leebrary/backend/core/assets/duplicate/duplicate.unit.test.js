const { it, expect } = require('@jest/globals');
const { generateCtx } = require('leemons-testing');

const { duplicate } = require('./duplicate');
const getAssets = require('../../../__fixtures__/getAssets');
const getAssetsAddDataInput = require('../../../__fixtures__/getAssetAddDataInput');
const getUserSession = require('../../../__fixtures__/getUserSession');

// MOCKS
jest.mock('./checkDuplicatePermissions');
jest.mock('./getAndCheckAsset.js');
const { checkDuplicatePermissions } = require('./checkDuplicatePermissions');
const { getAndCheckAsset } = require('./getAndCheckAsset');

const inputBookmark = {
  assetId: 'fullId@1.0.0', // the asset's full id
  indexable: undefined,
  newId: undefined,
  preserveName: false, // defaults to false
  public: undefined,
};

const { bookmarkAsset } = getAssets();
const { dataInput: addDataInput } = getAssetsAddDataInput();

it('Should correctly duplicate a bookmark asset', () => {
  // Arrange
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

  getAndCheckAsset.mockResolvedValue({ ...bookmarkAsset });

  // Act
  // const response = duplicate({ assetId: bookmarkAsset.id, ctx });

  // Assert
  // expect(checkDuplicatePermissions).toBeCalledWith({
  //   assetId: bookmarkAsset.id,
  //   ctx,
  // });
  // expect(getAndCheckAsset).toBeCalledWith({ assetId: bookmarkAsset.id, ctx });
  // expect(response).toBe(expectedResponse);
});
