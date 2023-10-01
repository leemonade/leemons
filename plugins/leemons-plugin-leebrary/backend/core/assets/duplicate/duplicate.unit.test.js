const { it, expect, beforeEach } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');
const { omit } = require('lodash');

const { duplicate } = require('./duplicate');
const getAssets = require('../../../__fixtures__/getAssets');
const getUserSession = require('../../../__fixtures__/getUserSession');
const getCategory = require('../../../__fixtures__/getCategory');
const getBookmarkFromDB = require('../../../__fixtures__/getBookmarkFromDB');
const getMediaFileData = require('../../../__fixtures__/getMediaFileData');

// MOCKS
jest.mock('./checkDuplicatePermissions');
jest.mock('./getAndCheckAsset.js');
jest.mock('../../categories/checkDuplicable');
jest.mock('./getFileIds');
jest.mock('../../bookmarks/getByAsset');
jest.mock('./getFilesToDuplicate');
jest.mock('./handleTags.js');
jest.mock('./handleAssetDuplication.js');
jest.mock('./handleCoverDuplication.js');
jest.mock('./handleBookmarkDuplication.js');
jest.mock('./handleFilesDuplication');
const { checkDuplicatePermissions } = require('./checkDuplicatePermissions');
const { getAndCheckAsset } = require('./getAndCheckAsset');
const { checkDuplicable: checkCategoryDuplicable } = require('../../categories/checkDuplicable');
const { getFileIds } = require('./getFileIds');
const { getByAsset: getBookmark } = require('../../bookmarks/getByAsset');
const { getFilesToDuplicate } = require('./getFilesToDuplicate');
const { handleAssetDuplication } = require('./handleAssetDuplication');
const { handleCoverDuplication } = require('./handleCoverDuplication');
const { handleBookmarkDuplication } = require('./handleBookmarkDuplication');
const { handleTags } = require('./handleTags');
const { handleFilesDuplication } = require('./handleFilesDuplication');

beforeEach(() => jest.resetAllMocks());

const { bookmarkAsset, mediaFileAsset } = getAssets();
const { categoryObject, mediaFileCategoryObject } = getCategory();
const { imageFile, audioFile } = getMediaFileData();

it('Should correctly duplicate a bookmark asset', async () => {
  // Arrange
  const assetFromDB = { ...bookmarkAsset, cover: bookmarkAsset.cover.id };
  delete assetFromDB.subjects;
  delete assetFromDB.tags;
  delete assetFromDB.file;
  const bookmark = getBookmarkFromDB();
  const mockFilesToDuplicate = [
    {
      id: bookmark.icon,
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
    {
      ...imageFile,
      metadata: JSON.stringify(imageFile.metadata),
    },
  ];
  const newAsset = {
    ...bookmarkAsset,
    name: `${assetFromDB.name} (1)`,
    cover: null,
    id: 'newAssetId',
    subjects: undefined,
  };
  const newCover = {
    ...mockFilesToDuplicate[1],
    id: 'newCoverId',
    uri: 'leemons/leebrary/newCoverId.png',
  };
  const newIcon = { ...imageFile, id: 'newIconId', uri: 'leemons/leebrary/newIconId.png' };

  const expectedResponse = {
    ...newAsset,
    cover: { ...newCover },
    url: bookmark.url,
    fileType: 'bookmark',
    metadata: [],
    icon: { ...newIcon },
  };

  const ctx = generateCtx({});
  ctx.meta.userSession = getUserSession();

  getAndCheckAsset.mockResolvedValue({ ...assetFromDB });
  checkCategoryDuplicable.mockResolvedValue({ ...categoryObject });
  getFileIds.mockResolvedValue([assetFromDB.cover]);
  getBookmark.mockResolvedValue({ ...bookmark });
  getFilesToDuplicate.mockResolvedValue({
    filesToDuplicate: [{ ...mockFilesToDuplicate[0] }, { ...mockFilesToDuplicate[1] }],
    cover: { ...mockFilesToDuplicate[1] },
  });
  handleTags.mockResolvedValue([...bookmarkAsset.tags]);
  handleAssetDuplication.mockResolvedValue({ ...newAsset });
  handleCoverDuplication.mockResolvedValue({ ...newAsset, cover: newCover });
  handleBookmarkDuplication.mockResolvedValue({
    ...newAsset,
    cover: { ...newCover },
    url: bookmark.url,
    fileType: 'bookmark',
    metadata: [],
    icon: { ...newIcon },
  });

  // Act
  const response = await duplicate({ assetId: bookmarkAsset.id, ctx });

  // Assert
  expect(checkDuplicatePermissions).toBeCalledWith({
    assetId: bookmarkAsset.id,
    ctx,
  });
  expect(getAndCheckAsset).toBeCalledWith({ assetId: bookmarkAsset.id, ctx });
  expect(checkCategoryDuplicable).toBeCalledWith({
    categoryId: bookmarkAsset.category,
    ctx,
  });
  expect(getFileIds).toBeCalledWith({
    asset: { ...assetFromDB },
    ctx,
  });
  expect(getBookmark).toBeCalledWith({ assetId: assetFromDB.id, ctx });
  expect(getFilesToDuplicate).toBeCalledWith({
    filesIds: [assetFromDB.cover, bookmark.icon],
    coverId: assetFromDB.cover,
    ctx,
  });
  expect(handleTags).toBeCalledWith({ assetId: assetFromDB.id, ctx });
  expect(handleAssetDuplication).toBeCalledWith({
    asset: { ...assetFromDB, fileType: 'bookmark', metadata: [] },
    tags: bookmarkAsset.tags,
    preserveName: false,
    permissions: [],
    isIndexable: undefined,
    isPublic: undefined,
    ctx,
  });
  expect(handleCoverDuplication).toBeCalledWith({
    newAsset: { ...newAsset },
    cover: mockFilesToDuplicate[1],
    ctx,
  });
  expect(handleBookmarkDuplication).toBeCalledWith({
    newAsset: { ...newAsset, cover: newCover },
    bookmark,
    filesToDuplicate: [mockFilesToDuplicate[0]],
    ctx,
  });
  expect(handleFilesDuplication).not.toBeCalled();
  expect(response).toEqual(expectedResponse);
});

it('Should correctly duplicate a mediaFile asset', async () => {
  // Arrange
  const ctx = generateCtx({});
  ctx.meta.userSession = getUserSession();

  const assetFromDB = { ...mediaFileAsset, cover: mediaFileAsset.cover.id };
  delete assetFromDB.subjects;
  delete assetFromDB.tags;
  delete assetFromDB.file;
  const mockFilesToDuplicate = [
    {
      id: audioFile.id,
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
    {
      ...imageFile,
      metadata: JSON.stringify(imageFile.metadata),
    },
  ];
  const newAsset = {
    ...mediaFileAsset,
    name: `${assetFromDB.name} (1)`,
    cover: null,
    id: 'newAssetId',
    subjects: undefined,
  };
  const newCover = {
    ...mockFilesToDuplicate[1],
    id: 'newCoverId',
    uri: 'leemons/leebrary/newCoverId.png',
  };

  getAndCheckAsset.mockResolvedValue({ ...assetFromDB });
  checkCategoryDuplicable.mockResolvedValue({ ...mediaFileCategoryObject });
  getFileIds.mockResolvedValue([assetFromDB.cover, mediaFileAsset.id]);
  getBookmark.mockResolvedValue(null);
  getFilesToDuplicate.mockResolvedValue({
    filesToDuplicate: [{ ...mockFilesToDuplicate[0] }, { ...mockFilesToDuplicate[1] }],
    cover: { ...mockFilesToDuplicate[1] },
  });
  handleTags.mockResolvedValue([...mediaFileAsset.tags]);
  handleAssetDuplication.mockResolvedValue({ ...newAsset });
  handleCoverDuplication.mockResolvedValue({ ...newAsset, cover: newCover });
  handleFilesDuplication.mockResolvedValue({ ...newAsset, cover: newCover });

  // Act
  const response = await duplicate({ assetId: assetFromDB.id, ctx });

  // Assert
  expect(getFilesToDuplicate).toBeCalledWith({
    filesIds: [assetFromDB.cover, mediaFileAsset.id],
    coverId: assetFromDB.cover,
    ctx,
  });
  expect(handleAssetDuplication).toBeCalledWith({
    asset: { ...assetFromDB },
    tags: mediaFileAsset.tags,
    preserveName: false,
    permissions: [],
    isIndexable: undefined,
    isPublic: undefined,
    ctx,
  });
  expect(handleCoverDuplication).toBeCalledWith({
    newAsset: { ...newAsset },
    cover: mockFilesToDuplicate[1],
    ctx,
  });
  expect(handleBookmarkDuplication).not.toBeCalled();
  expect(handleFilesDuplication).toBeCalledWith({
    newAsset: { ...newAsset, cover: newCover },
    cover: { ...newCover },
    category: { ...mediaFileCategoryObject },
    filesToDuplicate: [mockFilesToDuplicate[0]],
    ctx,
  });
  expect(response).toEqual({ ...newAsset, cover: newCover });
});

it('Should not try to duplicate files if none are related to the asset', async () => {
  // Arrange
  const assetOne = { id: 'assetOne', name: 'assetOne' };
  const bookmark = omit(getBookmarkFromDB(), ['icon', 'tags']);
  const newAsset = {
    ...bookmarkAsset,
    name: `${assetOne.name} (1)`,
    cover: null,
    id: 'newAssetId',
    subjects: undefined,
    tags: null,
  };
  const expectedResponse = {
    ...newAsset,
    cover: null,
    url: bookmark.url,
    fileType: 'bookmark',
    metadata: [],
    icon: null,
  };

  const ctx = generateCtx({});
  ctx.meta.userSession = getUserSession();

  getAndCheckAsset.mockResolvedValue({ ...assetOne });
  checkCategoryDuplicable.mockResolvedValue({ ...categoryObject });
  getFileIds.mockResolvedValue([]);
  getBookmark.mockResolvedValue({ ...bookmark });
  getFilesToDuplicate.mockResolvedValue({
    filesToDuplicate: [],
    cover: undefined,
  });
  handleTags.mockResolvedValue([]);
  handleAssetDuplication.mockResolvedValue({ ...newAsset });
  handleBookmarkDuplication.mockResolvedValue(expectedResponse);

  // Act
  const response = await duplicate({ assetId: bookmarkAsset.id, ctx });

  // Assert
  expect(getFilesToDuplicate).toBeCalledWith({
    filesIds: [],
    coverId: undefined,
    ctx,
  });
  expect(handleCoverDuplication).not.toBeCalled();
  expect(response).toEqual(expectedResponse);
});
