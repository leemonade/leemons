const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { findOne } = require('./findOne');
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

it('Should retrieve a setting by its ID from the database', async () => {
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

  await ctx.db.Settings.create(setting);

  // Act
  const response = await findOne({ ctx });

  // Assert
  expect(response.id).toEqual(setting.id);
});

it('Should return null when no setting is found in the database', async () => {
  // Arrange
  const ctx = generateCtx({
    models: {
      Settings: newModel(mongooseConnection, 'Settings', settingsSchema),
    },
  });

  // Act
  const response = await findOne({ ctx });

  // Assert
  expect(response).toBe(null);
});
