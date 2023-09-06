const { it, expect, beforeAll, afterAll, describe, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('leemons-testing');
const { newModel } = require('leemons-mongodb');

const { removeConfig } = require('./removeConfig');
const { configSchema } = require('../../models/config');

let mongooseConnection;
let disconnectMongoose;

describe('Remove Provider Config', () => {
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

  it('Should correctly remove a config and return null', async () => {
    // Arrange
    const ctx = generateCtx({
      models: {
        Config: newModel(mongooseConnection, 'Config', configSchema),
      },
    });

    // Populate the database with a config
    const configData = {
      id: 'testId',
      deploymentID: 'testDeploymentId',
      bucket: 'testBucket',
      region: 'testRegion',
      accessKey: 'testAccessKey',
      secretAccessKey: 'testSecretAccessKey',
    };
    await ctx.tx.db.Config.create({ ...configData });

    // Act
    const response = await removeConfig({ ctx });

    // Assert
    expect(response).toBeNull();

    // Check if the record is removed
    const removedConfig = await ctx.tx.db.Config.findOne({ id: configData.id }).lean();
    expect(removedConfig).toBeNull();
  });

  it('Should return null if no config is found', async () => {
    // Arrange
    const ctx = generateCtx({
      models: {
        Config: newModel(mongooseConnection, 'Config', configSchema),
      },
    });

    // Act
    const response = await removeConfig({ ctx });

    // Assert
    expect(response).toBeNull();
  });
});
