const {
  it,
  expect,
  jest: { fn },
} = require('@jest/globals');
const { generateCtx } = require('leemons-testing');

const { add } = require('./add');
const { CATEGORIES } = require('../../../config/constants');
const getAssets = require('../../../__fixtures__/getAssets');
const getAssetAddDataInput = require('../../../__fixtures__/getAssetAddDataInput');
const getUserSession = require('../../../__fixtures__/getUserSession');
const getMediaFileData = require('../../../__fixtures__/getMediaFileData');

// MOCKS
jest.mock('../../validations/forms');
jest.mock('../../bookmarks/add');
jest.mock('./handleBookmarkData');
jest.mock('./handleUserSessionData');
jest.mock('./handleCategoryData');
jest.mock('./checkAndHandleCanUse');
jest.mock('./handleFileUpload');
jest.mock('./handleVersion');
jest.mock('./createAssetInDB');
jest.mock('./handleSubjects');
jest.mock('./handlePermissions');
jest.mock('./handleFiles');
const { validateAddAsset } = require('../../validations/forms');
const { add: addBookmark } = require('../../bookmarks/add');
const { handleBookmarkData } = require('./handleBookmarkData');
const { handleUserSessionData } = require('./handleUserSessionData');
const { handleCategoryData } = require('./handleCategoryData');
const { checkAndHandleCanUse } = require('./checkAndHandleCanUse');
const { handleFileUpload } = require('./handleFileUpload');
const { handleVersion } = require('./handleVersion');
const { createAssetInDB } = require('./createAssetInDb');
const { handleSubjects } = require('./handleSubjects');
const { handlePermissions } = require('./handlePermissions');
const { handleFiles } = require('./handleFiles');

const { dataInput: bookMarkDataInput, cover } = getAssetAddDataInput();
const { mediaFileAsset, bookmarkAsset } = getAssets();
const userSession = getUserSession();
const { imageFile, audioFile } = getMediaFileData();

it('Should correctly add a new bookmark', async () => {
  // Arrange
  const mockNewId = 'fullId@1.0.0';
  const assetDataAfterHandleUserSession = {
    name: bookMarkDataInput.name,
    color: bookMarkDataInput.color,
    description: bookMarkDataInput.description,
    icon: bookMarkDataInput.icon,
    program: bookMarkDataInput.program,
    tagline: bookMarkDataInput.tagline,
    url: bookMarkDataInput.url,
    fromUser: '5738414e-3c5e-40a4-9b89-e5d27adc3719',
    fromUserAgent: 'a1c917f3-8771-4f92-8e2d-18657b3ec709',
  };
  const assetAfterDB = {
    ...bookmarkAsset,
    id: mockNewId,
    cover: imageFile.id,
  };
  delete assetAfterDB.subjects;
  delete assetAfterDB.file;
  delete assetAfterDB.tags;
  const newBookmarkExpectedResponse = { ...bookmarkAsset, id: mockNewId };
  const setTagsToValuesMock = fn();

  handleUserSessionData.mockReturnValue(assetDataAfterHandleUserSession);
  handleCategoryData.mockResolvedValue({ ...bookMarkDataInput.category });
  handleFileUpload.mockResolvedValue({ newFile: null, coverFile: { ...imageFile } });
  handleVersion.mockResolvedValue(mockNewId);
  createAssetInDB.mockResolvedValue(assetAfterDB);
  addBookmark.mockResolvedValue(true);

  const ctx = generateCtx({
    actions: {
      'common.tags.setTagsToValues': setTagsToValuesMock,
    },
    caller: 'leebrary',
  });
  ctx.meta.userSession = { ...userSession };

  // Act
  const bookmarkResponse = await add({
    assetData: { ...bookMarkDataInput, cover, categoryKey: undefined },
    ctx,
  });
  // console.log('bookmarkResponse', bookmarkResponse);

  // Assert
  expect(handleUserSessionData).toBeCalledWith({
    assetData: {
      name: bookMarkDataInput.name,
      color: bookMarkDataInput.color,
      description: bookMarkDataInput.description,
      icon: bookMarkDataInput.icon,
      program: bookMarkDataInput.program,
      tagline: bookMarkDataInput.tagline,
      url: bookMarkDataInput.url,
    },
    ctx,
  });
  expect(handleCategoryData).toBeCalledWith({
    category: bookMarkDataInput.category,
    categoryId: bookMarkDataInput.categoryId,
    categoryKey: 'media-files', // default value
    ctx,
  });
  expect(checkAndHandleCanUse).toBeCalledWith({
    category: bookMarkDataInput.category,
    calledFrom: ctx.callerPlugin,
    ctx,
  });
  expect(handleFileUpload).toBeCalledWith({
    file: undefined,
    cover,
    assetName: bookMarkDataInput.name,
    ctx,
  });
  expect(handleVersion).toBeCalledWith({
    newId: undefined,
    categoryId: bookMarkDataInput.categoryId,
    published: true,
    ctx,
  });
  expect(createAssetInDB).toBeCalledWith({
    newId: mockNewId,
    categoryId: bookMarkDataInput.categoryId,
    coverId: imageFile.id,
    assetData: { ...assetDataAfterHandleUserSession, indexable: true },
    ctx,
  });
  expect(handleSubjects).toBeCalledWith({
    subjects: bookMarkDataInput.subjects,
    assetId: assetAfterDB.id,
    ctx,
  });
  expect(handlePermissions).toBeCalledWith({
    permissions: [],
    canAccess: undefined,
    asset: assetAfterDB,
    category: bookMarkDataInput.category,
    ctx,
  });
  expect(handleFiles).toBeCalledWith({
    newFile: null,
    assetId: assetAfterDB.id,
    ctx,
  });
  expect(addBookmark).toBeCalledWith({
    url: bookMarkDataInput.url,
    iconUrl: bookMarkDataInput.icon,
    asset: assetAfterDB,
    ctx,
  });
  expect(setTagsToValuesMock).toBeCalledWith({
    type: ctx.prefixPN(''),
    tags: bookMarkDataInput.tags,
    values: assetAfterDB.id,
  });
  expect(bookmarkResponse).toEqual(newBookmarkExpectedResponse)
});

// ! se rompe: si no puede destructurar handleBookmarkData response
// ! se rompe: si no puede destructurar handleFileUpload response
