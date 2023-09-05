const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('leemons-testing');
const { newModel } = require('leemons-mongodb');
const { getConfig } = require('./getConfig');
const { configSchema } = require('../../models/config');

let mongooseConnection;
let disconnectMongoose;

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

it('Should return null if no configurations are found in the database', async () => {
  // Arrange
  const ctx = generateCtx({
    models: {
      Config: newModel(mongooseConnection, 'Config', configSchema),
    },
  });

  // Act
  const response = await getConfig({ ctx });

  // Assert
  expect(response).toBeNull();
});

it('Should return the first configuration object from the database if configurations are found', async () => {
  // Arrange
  const ctx = generateCtx({
    models: {
      Config: newModel(mongooseConnection, 'Config', configSchema),
    },
  });

  const configData = {
    deploymentID: 'testDeploymentId',
    bucket: 'testBucket',
    region: 'testRegion',
    accessKey: 'testAccessKey',
    secretAccessKey: 'testSecretAccessKey',
  };

  await ctx.tx.db.Config.create(configData);

  // Act
  const response = await getConfig({ ctx });

  // Assert
  expect(response.key).toEqual(configData.key);
  expect(response.value).toEqual(configData.value);
});
