/* eslint-disable sonarjs/no-duplicate-string */
const { it, expect, beforeAll, afterAll, beforeEach, describe } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { find } = require('./find');

const { bookmarksSchema } = require('../../../models/bookmarks');

let mongooseConnection;
let disconnectMongoose;
let ctx;
let params;

describe('Find Bookmark Test', () => {
  // Arrange: Set up the test environment
  beforeAll(async () => {
    const { mongoose, disconnect } = await createMongooseConnection();

    mongooseConnection = mongoose;
    disconnectMongoose = disconnect;

    ctx = generateCtx({
      models: {
        Bookmarks: newModel(mongooseConnection, 'Bookmarks', bookmarksSchema),
      },
    });
  });

  // Clean up after all tests have run
  afterAll(async () => {
    await disconnectMongoose();

    mongooseConnection = null;
    disconnectMongoose = null;
  });

  // Arrange: Set up the test parameters before each test
  beforeEach(async () => {
    await mongooseConnection.dropDatabase();
    jest.resetAllMocks();

    // Insert test data into the Bookmarks collection
    await ctx.tx.db.Bookmarks.create([
      {
        asset: 'asset1',
        url: 'https://test1.com',
        icon: 'icon1',
      },
      {
        asset: 'asset2',
        url: 'https://test2.com',
        icon: 'icon2',
      },
      {
        asset: 'asset3',
        url: 'https://test1.com',
        icon: 'icon3',
      },
    ]);

    params = {
      query: { url: 'https://test1.com' },
      columns: [],
      ctx,
    };
  });

  it('should find a bookmark in the database', async () => {
    // Arrange

    // Act
    const bookmark = await find(params);

    // Assert
    expect(bookmark.length).toBe(2);
  });

  it('should return only icon field', async () => {
    // Arrange
    params.columns = 'icon';
    // Act
    const bookmark = await find(params);

    // Assert
    expect(bookmark.length).toBe(2);
    expect(bookmark[0].icon).toBeDefined();
    expect(bookmark[1].url).not.toBeDefined();
  });

  it('should return empty array if no bookmark is found', async () => {
    // Arrange
    params.query = { url: 'https://nonexistent.com' };

    // Act
    const bookmark = await find(params);

    // Assert
    expect(bookmark).toStrictEqual([]);
  });
});
