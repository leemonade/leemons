const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { LeemonsError } = require('@leemons/error');

const { remove } = require('./remove');
const { bookmarksSchema } = require('../../../models/bookmarks');

let mongooseConnection;
let disconnectMongoose;
let ctx;
let bookmark;

jest.mock('../getByAsset');
const { getByAsset } = require('../getByAsset');

jest.mock('../../files/remove/remove');
const { remove: removeFiles } = require('../../files/remove/remove');

beforeAll(async () => {
  const { mongoose, disconnect } = await createMongooseConnection();

  mongooseConnection = mongoose;
  disconnectMongoose = disconnect;
});

afterAll(async () => {
  await disconnectMongoose();

  mongooseConnection = null;
  disconnectMongoose = null;
});

beforeEach(async () => {
  await mongooseConnection.dropDatabase();
  ctx = generateCtx({
    models: {
      Bookmarks: newModel(mongooseConnection, 'ExampleModel', bookmarksSchema),
    },
  });
  bookmark = {
    id: 'bookmarkId',
    asset: 'assetId',
    url: 'https://test1.com',
    icon: 'icon1',
  };

  await ctx.tx.db.Bookmarks.create(bookmark);
});

it('Should remove the bookmark', async () => {
  // Arrange

  getByAsset.mockResolvedValue(bookmark);

  // Act
  const response = await remove({ assetId: bookmark.asset, ctx });
  const removedBookmark = await ctx.tx.db.Bookmarks.findOne({ id: bookmark.id });

  // Assert
  expect(removeFiles).toBeCalledWith({ fileIds: bookmark.icon, assetId: bookmark.asset, ctx });
  expect(response).toEqual({ acknowledged: true, deletedCount: 1 });
  expect(removedBookmark).toBe(null);
});

it('Should soft remove the bookmark and icon file', async () => {
  // Arrange

  getByAsset.mockResolvedValue(bookmark);

  // Act
  const response = await remove({ assetId: bookmark.asset, soft: true, ctx });
  const removedBookmark = await ctx.tx.db.Bookmarks.findOne(
    {},
    { id: bookmark.id },
    { excludeDeleted: false }
  );

  // Assert
  expect(response.deletedCount).not.toBeDefined();
  expect(removedBookmark).toBeDefined();
});

it('Should soft remove the bookmark without icon file', async () => {
  // Arrange

  getByAsset.mockResolvedValue({ ...bookmark, icon: undefined });

  // Act
  const response = await remove({ assetId: bookmark.asset, soft: true, ctx });
  const removedBookmark = await ctx.tx.db.Bookmarks.findOne(
    {},
    { id: bookmark.id },
    { excludeDeleted: false }
  );

  // Assert
  expect(response.deletedCount).not.toBeDefined();
  expect(removedBookmark).toBeDefined();
});

it('Should throw an error when the bookmark is not found', async () => {
  // Arrange
  getByAsset.mockResolvedValue(null);
  const testFunc = async () => remove({ assetId: 'nonexistentAssetId', ctx });

  // Act and Assert
  await expect(testFunc()).rejects.toThrow('Bookmark not found');
});

it('Should throw an error when deletion fails', async () => {
  // Arrange
  getByAsset.mockResolvedValue(bookmark);
  const errorMessage = 'An error message';
  removeFiles.mockImplementation(() => {
    throw new Error(errorMessage);
  });
  const testFunc = async () => remove({ assetId: bookmark.asset, ctx });

  // Act and Assert
  await expect(testFunc()).rejects.toThrow(
    new LeemonsError(ctx, {
      message: `Failed to remove bookmark: ${errorMessage}`,
      httpStatusCode: 500,
    })
  );
});
