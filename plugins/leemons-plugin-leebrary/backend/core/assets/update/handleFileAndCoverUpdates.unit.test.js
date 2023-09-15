const { describe, afterEach, beforeEach, it, expect } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { handleFileAndCoverUpdates } = require('./handleFileAndCoverUpdates');
const { uploadFromSource } = require('../../files/helpers/uploadFromSource');
const { add: addFiles } = require('../files/add');

jest.mock('../../files/helpers/uploadFromSource');
jest.mock('../files/add');

describe('handleFileAndCoverUpdates', () => {
  let assetData;
  let updateObject;
  let currentAsset;
  let ctx;

  afterEach(() => jest.resetAllMocks());

  beforeEach(() => {
    assetData = { file: 'file', cover: 'cover', name: 'name' };
    updateObject = {};
    currentAsset = { file: 'oldFile', cover: 'oldCover' };
    ctx = generateCtx({});

    uploadFromSource.mockResolvedValue({ id: 'newId', type: 'image' });
    addFiles.mockResolvedValue();
  });

  it('should handle file and cover update', async () => {
    // Arrange
    const params = {
      assetId: 'assetId',
      assetData,
      updateObject,
      currentAsset,
      fileNeedsUpdate: true,
      coverNeedsUpdate: false,
      ctx,
    };

    // Act
    const result = await handleFileAndCoverUpdates(params);

    // Assert
    expect(uploadFromSource).toHaveBeenCalledWith({ source: 'file', name: 'name', ctx });
    expect(addFiles).toHaveBeenCalledWith({ fileId: 'newId', assetId: 'assetId', ctx });
    expect(result).toEqual({
      newFile: { id: 'newId', type: 'image' },
      coverFile: { id: 'newId', type: 'image' },
      toUpdate: { cover: 'newId' },
      filesToRemove: ['cover'],
    });
  });

  it('should handle file update', async () => {
    // Arrange
    const params = {
      assetId: 'assetId',
      assetData,
      updateObject,
      currentAsset,
      fileNeedsUpdate: true,
      coverNeedsUpdate: false,
      ctx,
    };
    uploadFromSource.mockResolvedValue({ id: 'newId', type: 'file' });

    // Act
    const result = await handleFileAndCoverUpdates(params);

    // Assert
    expect(uploadFromSource).toHaveBeenCalledWith({ source: 'file', name: 'name', ctx });
    expect(addFiles).toHaveBeenCalledWith({ fileId: 'newId', assetId: 'assetId', ctx });
    expect(result).toEqual({
      newFile: { id: 'newId', type: 'file' },
      coverFile: 'oldCover',
      toUpdate: {},
      filesToRemove: [],
    });
  });

  it('should handle cover update', async () => {
    // Arrange
    const params = {
      assetId: 'assetId',
      assetData,
      updateObject,
      currentAsset,
      fileNeedsUpdate: false,
      coverNeedsUpdate: true,
      ctx,
    };

    // Act
    const result = await handleFileAndCoverUpdates(params);

    // Assert
    expect(uploadFromSource).toHaveBeenCalledWith({ source: 'cover', name: 'name', ctx });
    expect(result).toEqual({
      newFile: 'oldFile',
      coverFile: { id: 'newId', type: 'image' },
      toUpdate: { cover: 'newId' },
      filesToRemove: [],
    });
  });

  it('should handle no updates', async () => {
    // Arrange
    const params = {
      assetId: 'assetId',
      assetData,
      updateObject,
      currentAsset,
      fileNeedsUpdate: false,
      coverNeedsUpdate: false,
      ctx,
    };

    // Act
    const result = await handleFileAndCoverUpdates(params);

    // Assert
    expect(uploadFromSource).not.toHaveBeenCalled();
    expect(result).toEqual({
      newFile: 'oldFile',
      coverFile: 'oldCover',
      toUpdate: {},
      filesToRemove: [],
    });
  });

  it('should handle cover update if assetData.coverFile contains ID', async () => {
    const params = {
      assetId: 'assetId',
      assetData: { ...assetData, cover: undefined, coverFile: 'cover' },
      updateObject,
      currentAsset,
      fileNeedsUpdate: true,
      coverNeedsUpdate: false,
      ctx,
    };

    // Act
    const result = await handleFileAndCoverUpdates(params);

    // Assert
    expect(result.filesToRemove).toContain('cover');
  });
});
