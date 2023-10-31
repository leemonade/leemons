const { it, expect } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');
const _ = require('lodash');

const { handleAssetDuplication } = require('./handleAssetDuplication');
const getAssets = require('../../../__fixtures__/getAssets');

// MOCKS
jest.mock('../add');
const { add } = require('../add');

const { bookmarkAsset } = getAssets();

it('Correctly call add asset and return the new one', async () => {
  // Arrange
  const asset = {
    ...bookmarkAsset,
    cover: bookmarkAsset.cover.id,
    fileType: 'bookmark',
    metadata: [],
  };
  delete asset.subjects;
  delete asset.tags;
  delete asset.file;

  const assetData = _.omit({ ...asset }, [
    '_id',
    'id',
    'cover',
    'icon',
    'category',
    'fromUser',
    'fromUserAgent',
    'created_at',
    'updated_at',
  ]);

  const expectedResponseBookmark = { ...bookmarkAsset, name: `${asset.name} (1)` };

  const ctx = generateCtx({});
  add.mockResolvedValue(expectedResponseBookmark);

  // Act
  const responseBookmark = await handleAssetDuplication({
    asset: { ...asset },
    tags: bookmarkAsset.tags,
    preserveName: undefined,
    permissions: [],
    ctx,
  });
  add.mockResolvedValue({ ...bookmarkAsset });
  await handleAssetDuplication({
    asset: { ...asset },
    tags: bookmarkAsset.tags,
    preserveName: true,
    permissions: [],
    isIndexable: false,
    isPublic: true,
    ctx,
  });

  // Assert
  expect(add).nthCalledWith(1, {
    asset: {
      ...assetData,
      tags: bookmarkAsset.tags,
      name: `${asset.name} (1)`,
      categoryId: asset.category,
      permissions: [],
      indexable: asset.indexable,
      public: bookmarkAsset.public,
    },
    duplicating: true,
    newId: undefined,
    ctx,
  });
  expect(add).nthCalledWith(2, {
    asset: {
      ...assetData,
      tags: bookmarkAsset.tags,
      name: asset.name,
      categoryId: asset.category,
      permissions: [],
      indexable: false,
      public: true,
    },
    duplicating: true,
    newId: undefined,
    ctx,
  });
  expect(responseBookmark).toEqual(expectedResponseBookmark);
});
