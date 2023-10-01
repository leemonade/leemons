const { it, expect, beforeEach } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { handleFilesDuplication } = require('./handleFilesDuplication');
const getMediaFileData = require('../../../__fixtures__/getMediaFileData');
const getAssets = require('../../../__fixtures__/getAssets');
const getCategory = require('../../../__fixtures__/getCategory');

// MOCKS
jest.mock('../files/add/add');
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
  const duplicatedFile = { ...filesToDuplicate[0], id: 'dupAudioFileId' };
  const newAsset = {
    ...mediaFileAsset,
    name: `${mediaFileAsset.name} (1)`,
    cover: null,
    id: 'newAssetId',
    subjects: undefined,
  };

  const ctx = generateCtx({});
  const expectedResponse = { ...newAsset, file: duplicatedFile };

  duplicateFile.mockResolvedValue(duplicatedFile);
  addFiles.mockResolvedValue(true);

  // Act
  const response = await handleFilesDuplication({
    filesToDuplicate,
    newAsset,
    category: mediaFileCategoryObject,
    ctx,
  });

  // Assert
  expect(response).toEqual(expectedResponse);
  expect(duplicateFile).toHaveBeenCalledWith({ file: filesToDuplicate[0], ctx });
  expect(addFiles).toHaveBeenCalledWith({
    fileId: duplicatedFile.id,
    assetId: newAsset.id,
    skipPermissions: true,
    ctx,
  });
});

it('Should correctly duplicate an image file for an image asset where the cover is the file', async () => {
  // Arrange
  const filesToDuplicate = [];
  const newAsset = {
    ...mediaFileAsset,
    name: `${mediaFileAsset.name} (1)`,
    id: 'newAssetId',
    subjects: undefined,
  };
  const cover = {
    ...imageFile,
    metadata: JSON.stringify(imageFile.metadata),
  };
  const ctx = generateCtx({});
  const expectedResponse = { ...newAsset };

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

it('Should try to add or duplicate files if no cover or files to duplicate are passed', async () => {
  // Arrange
  const filesToDuplicate = undefined;
  const newAsset = {
    ...mediaFileAsset,
    name: `${mediaFileAsset.name} (1)`,
    cover: null,
    id: 'newAssetId',
    subjects: undefined,
  };
  const cover = null;
  const ctx = generateCtx({});
  const expectedResponse = { ...newAsset };

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
  expect(addFiles).not.toHaveBeenCalled();
});
