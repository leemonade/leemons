const { afterEach, describe, expect, it } = require('@jest/globals');
const { cloneDeep } = require('lodash');

const { handleFilesRemoval } = require('./handleFilesRemoval');
const { remove: removeFilesById } = require('../files/remove');

jest.mock('../files/remove');

describe('handleFilesRemoval', () => {
  // Arrange
  const assetId = 'testAssetId';
  const assetData = {
    file: 'testFile',
    cover: 'testCover',
    coverFile: 'testCoverFile',
  };
  const filesToRemove = ['file1'];
  const ctx = {};

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should remove file if fileNeedsUpdate is true', async () => {
    // Arrange
    const fileNeedsUpdate = true;
    const coverNeedsUpdate = false;

    // Act
    await handleFilesRemoval({
      assetId,
      assetData,
      filesToRemove: cloneDeep(filesToRemove),
      fileNeedsUpdate,
      coverNeedsUpdate,
      ctx,
    });

    // Assert
    expect(removeFilesById).toHaveBeenCalledWith({
      fileIds: [...filesToRemove, assetData.file],
      assetId,
      ctx,
    });
  });

  it('should remove cover and coverFile if coverNeedsUpdate is true', async () => {
    // Arrange
    const fileNeedsUpdate = false;
    const coverNeedsUpdate = true;

    // Act
    await handleFilesRemoval({
      assetId,
      assetData,
      filesToRemove: cloneDeep(filesToRemove),
      fileNeedsUpdate,
      coverNeedsUpdate,
      ctx,
    });

    // Assert
    expect(removeFilesById).toHaveBeenCalledWith({
      fileIds: [...filesToRemove, assetData.cover, assetData.coverFile],
      assetId,
      ctx,
    });
  });

  it('should not remove any files if fileNeedsUpdate and coverNeedsUpdate are false', async () => {
    // Arrange
    const fileNeedsUpdate = false;
    const coverNeedsUpdate = false;

    // Act
    await handleFilesRemoval({
      assetId,
      assetData,
      filesToRemove: [],
      fileNeedsUpdate,
      coverNeedsUpdate,
      ctx,
    });

    // Assert
    expect(removeFilesById).not.toHaveBeenCalled();
  });

  it('should not throw an error if removeFilesById fails', async () => {
    // Arrange
    const fileNeedsUpdate = true;
    const coverNeedsUpdate = false;
    removeFilesById.mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    // Act and Assert
    await expect(
      handleFilesRemoval({
        assetId,
        assetData,
        filesToRemove,
        fileNeedsUpdate,
        coverNeedsUpdate,
        ctx,
      })
    ).not.rejects;
  });
});
