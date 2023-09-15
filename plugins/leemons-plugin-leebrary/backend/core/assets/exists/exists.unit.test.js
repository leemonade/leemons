const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { exists } = require('./exists');
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

it('Should determine wether an asset exists in db', async () => {
  // Arrange
  const asset = { id: 'assetOne' };

  const ctx = generateCtx({
    models: {
      Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
    },
  });

  const initialValues = [asset, { id: 'assetTwo' }];
  await ctx.db.Assets.create(initialValues);

  // Act
  const responseTrue = await exists({ assetId: asset.id, ctx });
  const responseFalse = await exists({ assetId: 'assetThree', ctx });

  // Assert
  expect(responseTrue).toBe(true);
  expect(responseFalse).toBe(false);
});

it('Should return false if assetId is an unexpected type of value', async () => {
  // Arrange
  const ctx = generateCtx({
    models: {
      Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
    },
  });

  // Act
  const assetIdUndefined = await exists({ ctx });
  const assetIdEmpty = await exists({ assetId: '', ctx });
  const assetIdNull = await exists({ assetId: null, ctx });
  const assetIdObj = await exists({ assetId: { assetId: '123' }, ctx });
  const assetIdNumber = await exists({ assetId: 8, ctx });

  // Assert
  expect(assetIdUndefined).toBe(false);
  expect(assetIdEmpty).toBe(false);
  expect(assetIdNull).toBe(false);
  expect(assetIdObj).toBe(false);
  expect(assetIdNumber).toBe(false);
});
