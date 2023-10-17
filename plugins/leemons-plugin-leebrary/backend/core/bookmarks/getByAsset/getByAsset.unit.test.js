const { expect, beforeAll, beforeEach, afterAll, describe, it } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { getByAsset } = require('./getByAsset');

const { bookmarksSchema } = require('../../../models/bookmarks');

describe('Get By Asset Bookmark Test', () => {
  // Arrange: Set up the test environment
  let mongooseConnection;
  let disconnectMongoose;
  let ctx;
  let params;

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
      assetId: 'asset1',
      columns: [],
      ctx,
    };
  });

  it('should find a bookmark by asset in the database', async () => {
    // Arrange

    // Act
    const bookmark = await getByAsset(params);

    // Assert
    expect(bookmark).toBeDefined();
    expect(bookmark.asset).toBe('asset1');
  });

  it('should return only icon field', async () => {
    // Arrange
    params.columns = 'icon';
    // Act
    const bookmark = await getByAsset(params);

    // Assert
    expect(bookmark.icon).toBeDefined();
    expect(bookmark.url).not.toBeDefined();
  });

  it('should return null if no bookmark is found', async () => {
    // Arrange
    params.assetId = 'nonexistentAsset';

    // Act
    const bookmark = await getByAsset(params);

    // Assert
    expect(bookmark).toBeNull();
  });
});
