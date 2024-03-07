const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { setActiveProvider } = require('./setActiveProvider');
const { settingsSchema } = require('../../../models/settings');

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

it('Should set the active provider in the settings', async () => {
  // Arrange
  const setting = {
    id: 'settingOneId',
    deploymentID: 'deploymentOneId',
    defaultCategory: 'defaultCategoryOne',
    providerName: 'providerNameOne',
  };

  const ctx = generateCtx({
    models: {
      Settings: newModel(mongooseConnection, 'Settings', settingsSchema),
    },
  });

  await ctx.tx.db.Settings.create(setting);

  // Act
  const response = await setActiveProvider({ providerName: 'providerNameTwo', ctx });

  // Assert
  expect(response.providerName).toEqual('providerNameTwo');
});
