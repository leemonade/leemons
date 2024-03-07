const {
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  jest: { fn },
} = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { setProviderConfig } = require('./setProviderConfig');
const { settingsSchema } = require('../../../models/settings');
const { getByName: getProviderByName } = require('../../providers/getByName');

jest.mock('../../providers/getByName');

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
  jest.resetAllMocks();
});

it('Should set provider config correctly', async () => {
  // Arrange
  const providerName = 'providerOne';
  const config = { key: 'key', value: 'value' };
  const setConfigAction = fn();
  const ctx = generateCtx({
    models: {
      Settings: newModel(mongooseConnection, 'Settings', settingsSchema),
    },
    actions: {
      [`${providerName}.config.setConfig`]: setConfigAction,
    },
    caller: 'leebrary',
  });
  const provider = { pluginName: providerName, supportedMethods: { setConfig: true } };
  getProviderByName.mockReturnValue(provider);

  // Act
  await setProviderConfig({ providerName, config, ctx });

  // Assert
  expect(getProviderByName).toBeCalledWith({
    name: providerName,
    ctx,
  });
  expect(setConfigAction).toBeCalledWith({
    config: {
      key: config.key,
      value: config.value,
    },
  });
});

it('Should throw an error if the caller is not supported', async () => {
  // Arrange
  const providerName = 'providerOne';
  const config = { key: 'key', value: 'value' };
  const ctx = generateCtx({
    caller: 'unsupportedCaller',
  });

  // Act and Assert
  await expect(setProviderConfig({ providerName, config, ctx })).rejects.toThrow(
    'Must be called from leemons-plugin-leebrary'
  );
});

it('Should throw an error if the provider is not found', async () => {
  // Arrange
  const providerName = 'nonExistentProvider';
  const config = { key: 'key', value: 'value' };
  const ctx = generateCtx({
    caller: 'leebrary',
  });
  getProviderByName.mockReturnValue(null);

  // Act and Assert
  await expect(setProviderConfig({ providerName, config, ctx })).rejects.toThrow(
    'The provider "nonExistentProvider" not found'
  );
});

it('Should throw an error if the provider does not support setConfig method', async () => {
  // Arrange
  const providerName = 'providerWithoutSetConfig';
  const config = { key: 'key', value: 'value' };
  const ctx = generateCtx({
    caller: 'leebrary',
  });
  const provider = { pluginName: providerName, supportedMethods: {} };
  getProviderByName.mockReturnValue(provider);

  // Act and Assert
  await expect(setProviderConfig({ providerName, config, ctx })).rejects.toThrow(
    'Bad implementation for media library, the service provider need the function: setConfig'
  );
});
