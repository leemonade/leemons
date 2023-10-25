const {
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  describe,
  jest: { spyOn },
} = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { add } = require('./add');

const { bookmarksSchema } = require('../../../models/bookmarks');

jest.mock('../../files/upload');
const { uploadFromUrl: uploadFileFromUrl } = require('../../files/upload');

let mongooseConnection;
let disconnectMongoose;
let ctx;
let params;

describe('Add Bookmark Test', () => {
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

    params = {
      url: 'http://example.com',
      iconUrl: 'http://example.com/icon.png',
      asset: { id: 'testId', name: 'assetName' },
      ctx,
    };
  });

  it('should add a bookmark to the database', async () => {
    // Arrange

    const spyLogger = spyOn(ctx.logger, 'error');
    uploadFileFromUrl.mockResolvedValue({ id: 'fileId' });

    // Act
    const bookmark = await add(params);

    // Assert')

    // Assert
    expect(bookmark.asset).toEqual(params.asset.id);
    expect(bookmark.icon).toEqual('fileId');

    expect(spyLogger).not.toHaveBeenCalled();
  });

  it('should add a bookmark to the database when no iconUrl is provided', async () => {
    // Arrange
    params.iconUrl = undefined;
    const spyLogger = spyOn(ctx.logger, 'error');
    uploadFileFromUrl.mockResolvedValue({ id: 'fileId' });

    // Act
    const bookmark = await add(params);

    // Assert
    expect(spyLogger).not.toHaveBeenCalled();
    expect(bookmark.icon).toBeUndefined();
  });

  it('Should add a bookmark to the database and write a log even if there is an error', async () => {
    // Arrange

    const spyLogger = spyOn(ctx.logger, 'error');
    uploadFileFromUrl.mockImplementation(() => {
      throw new Error(`-- ERROR: downloading file ${params.url} --`);
    });

    // Act
    const bookmark = await add(params);

    // Assert
    expect(spyLogger).toHaveBeenCalled();
    expect(bookmark.icon).toBeUndefined();
  });

  it('Should add a bookmark to the database if asset.name is undefined', async () => {
    // Arrange
    const spyLogger = spyOn(ctx.logger, 'error');
    uploadFileFromUrl.mockResolvedValue({ id: 'fileId' });

    // Act
    const bookmark = await add({ ...params, asset: { ...params.asset, name: undefined } });

    // Assert
    expect(spyLogger).not.toHaveBeenCalled();
    expect(bookmark.icon).toBe('fileId');
  });
});
