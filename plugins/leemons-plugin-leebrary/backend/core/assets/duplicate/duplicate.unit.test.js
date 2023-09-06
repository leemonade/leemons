const { it, expect } = require('@jest/globals');
const { generateCtx } = require('leemons-testing');

const { duplicate } = require('./duplicate');
const getAssets = require('../../../__fixtures__/getAssets');
const getAssetsAddDataInput = require('../../../__fixtures__/getAssetAddDataInput');
const getUserSession = require('../../../__fixtures__/getUserSession');
const getCategory = require('../../../__fixtures__/getCategory');
const getBookmarkFromDB = require('../../../__fixtures__/getBookmarkFromDB');
const getMediaFileData = require('../../../__fixtures__/getMediaFileData');

// MOCKS
jest.mock('./checkDuplicatePermissions');
jest.mock('./getAndCheckAsset.js');
jest.mock('../../categories/checkDuplicable');
jest.mock('../../bookmarks/getByAsset');
jest.mock('./getFilesToDuplicate');
jest.mock('./handleAssetDuplication.js');
jest.mock('./handleCoverDuplication.js');
const { checkDuplicatePermissions } = require('./checkDuplicatePermissions');
const { getAndCheckAsset } = require('./getAndCheckAsset');
const { checkDuplicable: checkCategoryDuplicable } = require('../../categories/checkDuplicable');
const { getFileIds } = require('./getFileIds');
const { getByAsset: getBookmark } = require('../../bookmarks/getByAsset');
const { getFilesToDuplicate } = require('./getFilesToDuplicate');
const { handleAssetDuplication } = require('./handleAssetDuplication');
const { handleCoverDuplication } = require('./handleCoverDuplication');

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
const { imageFile } = getMediaFileData();

it('Should correctly duplicate a bookmark asset', () => {
  // Arrange
  const asset = { ...bookmarkAsset, cover: bookmarkAsset.cover.id };
  delete asset.subjects;
  delete asset.tags;
  delete asset.file;
  const assetToDuplicate = { ...asset, fileType: 'bookmark', metadata: [] };
  const bookmark = getBookmarkFromDB();
  const mockFilesToDuplicate = [
    {
      ...imageFile,
    },
    {
      id: 'e42f215d-a3f1-4281-957d-409555b12b39',
      provider: 'leebrary-aws-s3',
      type: 'image/png',
      extension: 'png',
      name: 'Tecnología de aprendizaje colaborativo para pedagogías activas',
      size: 459,
      uri: 'leemons/leebrary/e42f215d-a3f1-4281-957d-409555b12b39.png',
      isFolder: null,
      metadata: '{"size":"459 B","format":"PNG","width":"32","height":"32"}',
      deleted: 0,
      created_at: '2023-09-04T12:35:16.000Z',
      updated_at: '2023-09-04T12:35:17.000Z',
      deleted_at: null,
    },
  ];
  const newAsset = {
    ...bookmarkAsset,
    name: `${asset.name} (1)`,
    cover: null,
    id: 'newAssetId',
    subjects: undefined,
  };
  const newCover = {
    ...mockFilesToDuplicate[0],
    id: 'newCoverId',
    uri: 'leemons/leebrary/newCoverId.png',
  };
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
  getFileIds.mockResolvedValue([asset.cover]);
  getBookmark.mockResolvedValue(bookmark);
  getFilesToDuplicate.mockResolvedValue({
    filesToDuplicate: mockFilesToDuplicate,
    cover: mockFilesToDuplicate[0],
  });
  handleAssetDuplication.mockResolvedValue(newAsset);
  handleCoverDuplication.mockResolvedValue({ ...newAsset, cover: newCover });

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
  // expect(getBookmark).toBeCalledWith({ assetId: asset.id, ctx });
  // expect(getFilesToDuplicate).toBeCalledWith({
  //   filesIds: [asset.cover, bookmark.icon],
  //   coverId: asset.cover,
  //   ctx,
  // });
  // expect(handleAssetDuplication).toBeCalledWith({
  //   asset: { ...assetToDuplicate },
  //   tags: bookmarkAsset.tags,
  //   preserveName: undefined,
  //   permissions: [],
  //   ctx,
  // });
  // expect(handleCoverDuplication).toBeCalledWith({
  //   newAsset,
  //   cover: mockFilesToDuplicate[0],
  //   ctx,
  // });

  // expect(response).toBe(expectedResponse);
});
