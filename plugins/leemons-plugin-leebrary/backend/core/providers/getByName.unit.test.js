const { it, expect, describe, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('leemons-testing');
const { newModel } = require('leemons-mongodb');
const { keyValueSchema } = require('leemons-mongodb-helpers');
const { getByName } = require('./getByName');
const getProviders = require('../../__fixtures__/getProviders');
const { list: listProviders } = require('./list');

jest.mock('./list');

let mongooseConnection;
let disconnectMongoose;

describe('Get Plugin Provider By Name', () => {
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
    listProviders.mockClear();
  });

  it('Should correctly get a plugin provider by name', async () => {
    // Arrange
    const ctx = generateCtx({
      models: {
        KeyValue: newModel(mongooseConnection, 'KeyValue', keyValueSchema),
      },
    });
    const { provider } = getProviders();
    listProviders.mockResolvedValue([{ ...provider.value }]);

    // Act
    const response = await getByName({ name: provider.value.pluginName, ctx });

    // Assert
    expect(response).toEqual(provider.value.params);
    expect(listProviders).toHaveBeenCalledWith({ ctx });
  });

  it('Should return null if no provider with the given name is found', async () => {
    // Arrange
    const ctx = generateCtx({
      models: {
        KeyValue: newModel(mongooseConnection, 'KeyValue', keyValueSchema),
      },
    });
    listProviders.mockResolvedValue([]);

    // Act
    const response = await getByName({ name: 'non-existent-provider', ctx });

    // Assert
    expect(response).toBeNull();
    expect(listProviders).toHaveBeenCalledWith({ ctx });
  });
});
