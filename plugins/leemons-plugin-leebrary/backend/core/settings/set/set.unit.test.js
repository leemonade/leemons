const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { set } = require('./set');
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

it('Should set a new setting if none exists', async () => {
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

  // Act
  await set({ settings: setting, ctx });

  // Assert
  const [response] = await ctx.tx.db.Settings.find({}).limit(1).lean();
  expect(response.providerName).toEqual(setting.providerName);
});

it('Should update an existing setting', async () => {
  // Arrange
  const setting = {
    id: 'settingOneId',
    deploymentID: 'deploymentOneId',
    defaultCategory: 'defaultCategoryOne',
    providerName: 'providerNameOne',
  };

  const updatedSetting = {
    ...setting,
    defaultCategory: 'updatedDefaultCategory',
  };

  const ctx = generateCtx({
    models: {
      Settings: newModel(mongooseConnection, 'Settings', settingsSchema),
    },
  });

  await ctx.db.Settings.create(setting);

  // Act
  await set({ settings: updatedSetting, ctx });

  // Assert
  const response = await ctx.db.Settings.findOne({ id: setting.id });
  expect(response.defaultCategory).toEqual(updatedSetting.defaultCategory);
});
