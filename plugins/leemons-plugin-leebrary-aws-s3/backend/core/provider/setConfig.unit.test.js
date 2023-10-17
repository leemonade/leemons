const {
  it,
  expect,
  beforeAll,
  afterAll,
  describe,
  afterEach,
  beforeEach,
} = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { setConfig } = require('./setConfig');
const { configSchema } = require('../../models/config');
const { hasPermissions } = require('./hasPermissions');

let mongooseConnection;
let disconnectMongoose;

jest.mock('./hasPermissions', () => ({
  hasPermissions: jest.fn(),
}));

describe('Updates Provider Config', () => {
  beforeAll(async () => {
    const { mongoose, disconnect } = await createMongooseConnection();

    mongooseConnection = mongoose;
    disconnectMongoose = disconnect;

    hasPermissions.mockResolvedValue(Promise.resolve(true));
  });

  afterAll(async () => {
    await disconnectMongoose();

    mongooseConnection = null;
    disconnectMongoose = null;
  });

  beforeEach(async () => {
    await mongooseConnection.dropDatabase();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should correctly set the configuration and return it as a plain object', async () => {
    // Arrange
    const newConfig = {
      accessKey: 'testAccessKey',
      secretAccessKey: 'testSecretAccessKey',
      region: 'testRegion',
      bucket: 'testBucket',
    };

    const ctx = generateCtx({
      models: {
        Config: newModel(mongooseConnection, 'Config', configSchema),
      },
    });

    // Act
    const response = await setConfig({ newConfig, ctx });
    const foundConfig = await ctx.tx.db.Config.findOne({}).lean();

    // Assert
    expect(response.accessKeyId).toEqual(foundConfig.accessKeyId);
    expect(response.secretAccessKey).toEqual(foundConfig.secretAccessKey);
    expect(response.region).toEqual(foundConfig.region);
    expect(response.bucket).toEqual(foundConfig.bucket);
  });
});
