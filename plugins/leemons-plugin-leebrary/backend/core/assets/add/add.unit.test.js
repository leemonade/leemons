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
const { createAssetInDB } = require('./createAssetInDB');
const { handleSubjects } = require('./handleSubjects');
const { handlePermissions } = require('./handlePermissions');
const { handleFiles } = require('./handleFiles');

const { dataInput: bookmarDataInput, cover } = getAssetAddDataInput();
const { mediaFileAsset, bookmarkAsset } = getAssets();
const userSession = getUserSession();
const { imageFile, audioFile } = getMediaFileData();

it('Should call add correctly', () => {
  // Arrange
  const newBookmarkResponse = { ...bookmarkAsset };
  const setTagsToValuesMock = fn();

  handleUserSessionData.mockReturnValue({
    ...bookmarDataInput,
    fromUser: '5738414e-3c5e-40a4-9b89-e5d27adc3719',
    fromUserAgent: 'a1c917f3-8771-4f92-8e2d-18657b3ec709'
  });
  handleFileUpload.mockResolvedValue({ newFile: null, coverFile: cover });

  const ctx = generateCtx({
    actions: {
      'common.tags.setTagsToValues': setTagsToValuesMock,
    },
  });
  ctx.meta.userSession = { ...userSession };

  // Act
  const bookmarkResponse = add({
    assetData: { ...bookmarDataInput, cover, categoryKey: undefined },
    ctx,
  });
  console.log('response', response);

  // Assert
  expect(bookmarkResponse).toBe(newBookmarkResponse);
});

// ! se rompe: si no puede destructurar handleBookmarkData response
// ! se rompe: si no puede destructurar handleFileUpload response
