const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('leemons-testing');
const { newModel } = require('leemons-mongodb');

const { handleBookmarkDuplication } = require('./handleBookmarkDuplication');
const { bookmarksSchema } = require('../../../models/bookmarks');
const getAssets = require('../../../__fixtures__/getAssets');
const getBookmarkFromDB = require('../../../__fixtures__/getBookmarkFromDB');
const getMediaFileData = require('../../../__fixtures__/getMediaFileData');

// MOCKS
jest.mock('../../files/duplicate');
const { duplicate: duplicateFile } = require('../../files/duplicate');

let mongooseConnection;
let disconnectMongoose;

const { bookmarkAsset } = getAssets();
const bookmarkFromDB = getBookmarkFromDB();
const { imageFile } = getMediaFileData();

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
});

it('Creates a new bookmark in the DB and, if bookmark has an a icon, it duplicates it and modifies the asset otherwise it does not.', async () => {
  // Arrange
  const asset = { ...bookmarkAsset };
  const bookmark = { ...bookmarkFromDB, icon: 'notTheCoverFile' };
  const filesToDuplicate = [{ ...imageFile, id: 'notTheCoverFile' }];
  const newIcon = { ...imageFile, id: 'newIconId', uri: 'leemons/leebrary/newIconId.png' };

  const ctx = generateCtx({
    models: {
      Bookmarks: newModel(mongooseConnection, 'Bookmarks', bookmarksSchema),
    },
  });

  duplicateFile.mockResolvedValue(newIcon);

  const expectedValue = {
    ...asset,
    url: bookmark.url,
    fileType: 'bookmark',
    metadata: [],
    icon: newIcon,
  };
  const expectedValueNoIcon = { ...asset, id: 'bookmarkWithNoIcon' };

  // Act
  const response = await handleBookmarkDuplication({
    newAsset: { ...asset },
    bookmark,
    filesToDuplicate,
    ctx,
  });
  const foundBookmark = await ctx.db.Bookmarks.findOne({ url: bookmark.url }).lean();
  const responseNoIcon = await handleBookmarkDuplication({
    newAsset: { ...asset, id: 'bookmarkWithNoIcon' },
    bookmark: { ...bookmark, icon: undefined },
    filesToDuplicate,
    ctx,
  });
  const foundBookmarkNoIcon = await ctx.db.Bookmarks.findOne({
    asset: 'bookmarkWithNoIcon',
  }).lean();

  // Assert
  expect(duplicateFile).toBeCalledWith({ file: filesToDuplicate[0], ctx });
  expect(foundBookmark.asset).toEqual(asset.id);
  expect(foundBookmark.icon).toEqual(newIcon.id);
  expect(response).toEqual(expectedValue);
  expect(duplicateFile).toBeCalledTimes(1);
  expect(foundBookmarkNoIcon.icon).toBe(null);
  expect(responseNoIcon).toEqual(expectedValueNoIcon);
});

it('Does not throw if file duplication retuns unexpected values', async () => {
  // Arrange
  const bookmark = { ...bookmarkFromDB };
  const unexpectedValue = undefined;

  const ctx = generateCtx({
    models: {
      Bookmarks: newModel(mongooseConnection, 'Bookmarks', bookmarksSchema),
    },
  });

  duplicateFile.mockResolvedValue(unexpectedValue);

  // Act
  const response = await handleBookmarkDuplication({
    newAsset: { ...bookmarkAsset },
    bookmark,
    filesToDuplicate: [],
    ctx,
  });

  // Assert
  expect(response).toEqual({
    ...bookmarkAsset,
    url: bookmark.url,
    icon: unexpectedValue,
    fileType: 'bookmark',
    metadata: [],
  });
});
