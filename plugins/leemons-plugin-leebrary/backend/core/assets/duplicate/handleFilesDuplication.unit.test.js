const { it, expect, beforeEach } = require('@jest/globals');
const { generateCtx } = require('leemons-testing');

const { handleFilesDuplication } = require('./handleFilesDuplication');
const getMediaFileData = require('../../../__fixtures__/getMediaFileData');
const getAssets = require('../../../__fixtures__/getAssets');
const getCategory = require('../../../__fixtures__/getCategory');

// MOCKS
jest.mock('../files/add');
jest.mock('../../files/duplicate');
const { add: addFiles } = require('../files/add/add');
const { duplicate: duplicateFile } = require('../../files/duplicate');

beforeEach(() => jest.resetAllMocks());

const { imageFile, audioFile } = getMediaFileData();
const { mediaFileAsset } = getAssets();
const { mediaFileCategoryObject } = getCategory();

it('Should correctly duplicate media files', async () => {
  // Arrange
  const filesToDuplicate = [
    {
      ...audioFile,
      id: 'audioFileId',
      uri: 'leemons/leebrary/audioFileId.mpga',
    },
  ];
  const newAsset = {
    ...mediaFileAsset,
    name: `${mediaFileAsset.name} (1)`,
    cover: null,
    id: 'newAssetId',
    subjects: undefined,
  };
  const cover = {
    ...imageFile,
    metadata: JSON.stringify(imageFile.metadata),
  };
  const ctx = generateCtx({});
  const expectedResponse = { ...newAsset, file: cover };

  // Mock the return values of the inner functions
  duplicateFile.mockResolvedValue(cover);
  addFiles.mockResolvedValue(true);

  // Act
  const response = await handleFilesDuplication({
    filesToDuplicate,
    cover,
    newAsset,
    category: mediaFileCategoryObject,
    ctx,
  });

  // Assert
  expect(response).toEqual(expectedResponse);
  expect(duplicateFile).toHaveBeenCalledWith({ file: filesToDuplicate[0], ctx });
  expect(addFiles).toHaveBeenCalledWith({
    fileId: cover.id,
    assetId: newAsset.id,
    skipPermissions: true,
    ctx,
  });
});

it('Should correctly duplicate an image file for an image asset, where the cover is the file', async () => {
  // Arrange
  const filesToDuplicate = [];
  const newAsset = {
    ...mediaFileAsset,
    name: `${mediaFileAsset.name} (1)`,
    cover: null,
    id: 'newAssetId',
    subjects: undefined,
  };
  const cover = {
    ...imageFile,
    metadata: JSON.stringify(imageFile.metadata),
  };
  const ctx = generateCtx({});
  const expectedResponse = { ...newAsset, file: cover };

  // Mock the return values of the inner functions
  duplicateFile.mockResolvedValue(cover);
  addFiles.mockResolvedValue(true);

  // Act
  const response = await handleFilesDuplication({
    filesToDuplicate,
    cover,
    newAsset,
    category: mediaFileCategoryObject,
    ctx,
  });

  // Assert
  expect(response).toEqual(expectedResponse);
  expect(duplicateFile).not.toHaveBeenCalled();
  expect(addFiles).toHaveBeenCalledWith({
    fileId: cover.id,
    assetId: newAsset.id,
    skipPermissions: true,
    ctx,
  });
});

// Test scenario: cover arrives as null
it('Should handle null cover correctly', async () => {
  // Arrange
  const filesToDuplicate = [{ ...audioFile }];
  const newAsset = {
    ...mediaFileAsset,
    name: `${mediaFileAsset.name} (1)`,
    cover: null,
    id: 'newAssetId',
    subjects: undefined,
  };
  const cover = null;
  const ctx = generateCtx({});
  const expectedResponse = { ...newAsset, file: { ...audioFile } };

  // Mock the return values of the inner functions
  duplicateFile.mockResolvedValue(filesToDuplicate[0]);
  addFiles.mockResolvedValue(true);

  // Act
  const response = await handleFilesDuplication({
    filesToDuplicate,
    cover,
    newAsset,
    category: mediaFileCategoryObject,
    ctx,
  });

  // Assert
  expect(response).toEqual(expectedResponse);
  expect(duplicateFile).toHaveBeenCalledWith({ file: { ...audioFile }, ctx });
  expect(addFiles).toHaveBeenCalledWith({
    fileId: audioFile.id,
    assetId: newAsset.id,
    skipPermissions: true,
    ctx,
  });
});
