const { it, expect, describe, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { filesSchema } = require('../../../models');
const getFile = require('../../../__fixtures__/getFile');
const { exists } = require('./exists');

let mongooseConnection;
let disconnectMongoose;

describe('Exists', () => {
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

  it('Should return true when file exists in the database', async () => {
    // Arrange
    const ctx = generateCtx({
      models: {
        Files: newModel(mongooseConnection, 'Files', filesSchema),
      },
    });
    const { file } = getFile();
    await ctx.tx.db.Files.create({ ...file, provider: 'sys' });

    // Act
    const result = await exists({ fileId: file.id, ctx });

    // Assert
    expect(result).toBe(true);
  });

  it('Should return false when file does not exist in the database', async () => {
    // Arrange
    const ctx = generateCtx({
      models: {
        Files: newModel(mongooseConnection, 'Files', filesSchema),
      },
    });
    const fileId = 'nonexistent-file-id';

    // Act
    const result = await exists({ fileId, ctx });

    // Assert
    expect(result).toBe(false);
  });
});
