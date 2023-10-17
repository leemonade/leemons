const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { handleIndexable } = require('./handleIndexable');
const { assetsSchema } = require('../../../models/assets');

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

it('Should call handleIndexable correctly', async () => {
  // Arrange
  const assetOne = { id: 'assetOne', indexable: true };
  const assetTwo = { id: 'assetTwo', indexable: false };
  const assetThree = { id: 'assetTwo', indexable: true };
  const resultsParam = [
    { asset: assetOne.id, role: 'viewer', permissions: {} },
    { asset: assetTwo.id, role: 'viewer', permissions: {} },
    { asset: assetThree.id, role: 'viewer', permissions: {} },
  ];
  const expectedResult = resultsParam.filter((item) => item.asset !== assetTwo.id);

  const ctx = generateCtx({
    models: {
      Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
    },
  });

  const initialValues = [assetOne, assetTwo];
  await ctx.db.Assets.create(initialValues);

  // Act
  const response = await handleIndexable({ results: resultsParam, ctx });

  // Assert
  expect(response).toEqual(expectedResult);
});
