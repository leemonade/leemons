/* eslint-disable sonarjs/no-duplicate-string */
const { describe, expect, it, beforeEach } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { handleUpdateObject } = require('./handleUpdateObject');
const { getById: getCategory } = require('../../categories/getById');
const { CATEGORIES } = require('../../../config/constants');

jest.mock('../../categories/getById');

describe('handleUpdateObject', () => {
  beforeEach(() => {
    getCategory.mockClear();
  });

  it('should handle update object correctly', async () => {
    // Arrange
    const currentAsset = {
      name: 'Asset 1',
      category: 'category-id',
      file: { id: 'file-id' },
      cover: { id: 'cover-id' },
      url: 'https:/url-currentAsset.com',
    };
    const assetData = {
      name: 'Asset 2',
      file: 'new-file-id',
      cover: 'new-cover-id',
      url: 'https:/url-assetData.com',
    };
    const ctx = generateCtx({});
    const expectedUpdateProperties = {
      name: 'Asset 2',
      file: 'new-file-id',
      cover: 'new-cover-id',
      url: 'https:/url-assetData.com',
    };
    const expectedNewData = {
      name: 'Asset 2',
      file: 'new-file-id',
      cover: 'new-cover-id',
      url: 'https:/url-assetData.com',
    };
    const expectedDiff = ['name', 'file', 'cover', 'url'];
    getCategory.mockResolvedValue({ key: CATEGORIES.BOOKMARKS });

    // Act
    const result = await handleUpdateObject({ currentAsset, assetData, ctx });

    // Assert
    expect(result).toEqual({
      updateProperties: expectedUpdateProperties,
      newData: expectedNewData,
      diff: expectedDiff,
    });
    expect(getCategory).toHaveBeenCalledWith({ id: currentAsset.category, ctx });
  });
  it('should handle update object correctly when category is not bookmark', async () => {
    // Arrange
    const currentAsset = {
      name: 'Asset 1',
      category: 'category-id',
      file: { id: 'file-id' },
      cover: { id: 'cover-id' },
      url: 'https:/url-currentAsset.com',
    };
    const assetData = {
      name: 'Asset 2',
      file: 'new-file-id',
      cover: 'new-cover-id',
      url: 'https:/url-assetData.com',
    };
    const ctx = generateCtx({});
    const expectedUpdateProperties = {
      name: 'Asset 2',
      file: 'new-file-id',
      cover: 'new-cover-id',
    };
    const expectedNewData = {
      name: 'Asset 2',
      file: 'new-file-id',
      cover: 'new-cover-id',
    };
    const expectedDiff = ['name', 'file', 'cover'];
    getCategory.mockResolvedValue({ key: CATEGORIES.MEDIA_FILES });

    // Act
    const result = await handleUpdateObject({ currentAsset, assetData, ctx });

    // Assert
    expect(result).toEqual({
      updateProperties: expectedUpdateProperties,
      newData: expectedNewData,
      diff: expectedDiff,
    });
    expect(getCategory).toHaveBeenCalledWith({ id: currentAsset.category, ctx });
  });
});
it('should handle update object correctly when currentAsset.file.id or currentAsset.cover.id does not exist', async () => {
  // Arrange
  const currentAsset = {
    name: 'Asset 1',
    category: 'category-id',
    file: null,
    cover: null,
    url: 'https:/url-currentAsset.com',
  };
  const assetData = {
    name: 'Asset 2',
    file: 'new-file-id',
    cover: 'new-cover-id',
    url: 'https:/url-assetData.com',
  };
  const ctx = generateCtx({});
  const expectedUpdateProperties = {
    name: 'Asset 2',
    file: 'new-file-id',
    cover: 'new-cover-id',
    url: 'https:/url-assetData.com',
  };
  const expectedNewData = {
    name: 'Asset 2',
    file: 'new-file-id',
    cover: 'new-cover-id',
    url: 'https:/url-assetData.com',
  };
  const expectedDiff = ['name', 'file', 'cover', 'url'];
  getCategory.mockResolvedValue({ key: CATEGORIES.BOOKMARKS });

  // Act
  const result = await handleUpdateObject({ currentAsset, assetData, ctx });

  // Assert
  expect(result).toEqual({
    updateProperties: expectedUpdateProperties,
    newData: expectedNewData,
    diff: expectedDiff,
  });
  expect(getCategory).toHaveBeenCalledWith({ id: currentAsset.category, ctx });
});
it('should handle update object correctly when cover comes in coverFile', async () => {
  // Arrange
  const currentAsset = {
    name: 'Asset 1',
    category: 'category-id',
    file: { id: 'file-id' },
    cover: { id: 'cover-id' },
    url: 'https:/url-currentAsset.com',
  };
  const assetData = {
    name: 'Asset 2',
    file: 'new-file-id',
    coverFile: 'new-cover-id',
    url: 'https:/url-assetData.com',
  };
  const ctx = generateCtx({});
  const expectedUpdateProperties = {
    name: 'Asset 2',
    file: 'new-file-id',
    cover: 'new-cover-id',
    url: 'https:/url-assetData.com',
  };
  const expectedNewData = {
    name: 'Asset 2',
    file: 'new-file-id',
    cover: 'new-cover-id',
    url: 'https:/url-assetData.com',
  };
  const expectedDiff = ['name', 'file', 'url', 'cover'];
  getCategory.mockResolvedValue({ key: CATEGORIES.BOOKMARKS });

  // Act
  const result = await handleUpdateObject({ currentAsset, assetData, ctx });

  // Assert
  expect(result).toEqual({
    updateProperties: expectedUpdateProperties,
    newData: expectedNewData,
    diff: expectedDiff,
  });
  expect(getCategory).toHaveBeenCalledWith({ id: currentAsset.category, ctx });
});
