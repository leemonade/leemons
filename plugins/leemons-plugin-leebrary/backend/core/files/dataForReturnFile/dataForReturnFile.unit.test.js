const { it, expect, describe, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { dataForReturnFile } = require('./dataForReturnFile');
const { filesSchema } = require('../../../models');
const { handleReadStream } = require('./handleReadStream');
const getFile = require('../../../__fixtures__/getFile');

jest.mock('./handleReadStream');

let mongooseConnection;
let disconnectMongoose;

describe('Data For Return File', () => {
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
    handleReadStream.mockClear();
  });

  it('Should correctly handle data for return file', async () => {
    // Arrange
    const ctx = generateCtx({
      models: {
        Files: newModel(mongooseConnection, 'Files', filesSchema),
      },
    });

    const { file } = getFile();
    file.provider = 'sys';

    // Mock handleReadStream to resolve a Buffer
    handleReadStream.mockResolvedValue(Buffer.from('test-data'));

    // Populate "Files" record in db
    await ctx.tx.db.Files.create(file);

    // Act
    const result = await dataForReturnFile({ id: file.id, ctx });

    // Assert
    expect(result).toHaveProperty('readStream');
    expect(Buffer.isBuffer(result.readStream)).toBeTruthy();
  });

  it('Should throw an error when there is no file in the database', async () => {
    // Arrange
    const ctx = generateCtx({
      models: {
        Files: newModel(mongooseConnection, 'Files', filesSchema),
      },
    });

    const id = 'nonexistent-file-id';

    // Act and Assert
    await expect(dataForReturnFile({ id, ctx })).rejects.toThrow();
  });

  it('Should throw an error when there is no readStream', async () => {
    // Arrange
    const ctx = generateCtx({
      models: {
        Files: newModel(mongooseConnection, 'Files', filesSchema),
      },
    });

    const { file } = getFile();
    file.provider = 'sys';

    // Mock handleReadStream to resolve null
    handleReadStream.mockResolvedValue(null);

    // Populate "Files" record in db
    await ctx.tx.db.Files.create(file);

    // Act and Assert
    await expect(dataForReturnFile({ id: file.id, ctx })).rejects.toThrow();
  });

  it('Should reassign the size of the file when metadata is present', async () => {
    // Arrange
    const ctx = generateCtx({
      models: {
        Files: newModel(mongooseConnection, 'Files', filesSchema),
      },
    });

    const path = 'test-path';
    const { file } = getFile();
    file.provider = 'sys';
    file.metadata = {
      pathsInfo: {
        [path]: {
          size: 500,
        },
      },
    };

    // Mock handleReadStream to resolve a Buffer
    handleReadStream.mockResolvedValue(Buffer.from('test-data'));

    // Populate "Files" record in db
    await ctx.tx.db.Files.create({ ...file, metadata: JSON.stringify(file.metadata) });

    // Act
    const result = await dataForReturnFile({ id: file.id, path, ctx });

    // Assert
    expect(result).toHaveProperty('readStream');
    expect(Buffer.isBuffer(result.readStream)).toBeTruthy();
    expect(result.file.size).toBe(500);
  });
});
