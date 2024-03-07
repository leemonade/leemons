const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { setDefaultCategory } = require('./setDefaultCategory');
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

it('Should set the default category for the settings', async () => {
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
    caller: 'leebrary',
  });

  await ctx.db.Settings.create(setting);

  // Act
  const response = await setDefaultCategory({ categoryId: 'newDefaultCategory', ctx });

  // Assert
  expect(response.defaultCategory).toEqual('newDefaultCategory');
});

it('Should throw an error when not called from leemons-plugin-leebrary', async () => {
  // Arrange
  const ctx = generateCtx({
    models: {
      Settings: newModel(mongooseConnection, 'Settings', settingsSchema),
    },
    caller: 'notLeebrary',
  });

  // Act and Assert
  await expect(setDefaultCategory({ categoryId: 'newDefaultCategory', ctx })).rejects.toThrow(
    'Must be called from leemons-plugin-leebrary'
  );
});
