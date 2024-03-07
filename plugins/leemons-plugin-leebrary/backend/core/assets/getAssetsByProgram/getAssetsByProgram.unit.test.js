const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { getAssetsByProgram } = require('./getAssetsByProgram');
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

it('Should return an array of asset IDs for a given program', async () => {
  // Arrange
  const program = 'programOne';
  const assets = [
    { id: 'assetOne', program: 'programOne' },
    { id: 'assetTwo', program: 'programTwo' },
  ];

  const ctx = generateCtx({
    models: {
      Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
    },
  });

  await ctx.db.Assets.create(assets);

  // Act
  const response = await getAssetsByProgram({
    program,
    assets: assets.map((asset) => asset.id),
    ctx,
  });

  // Assert
  expect(response).toEqual(['assetOne']);
});

it('Should return an empty array if no assets are associated with the program', async () => {
  // Arrange
  const program = 'programThree';
  const assets = [
    { id: 'assetOne', program: 'programOne' },
    { id: 'assetTwo', program: 'programTwo' },
  ];

  const ctx = generateCtx({
    models: {
      Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
    },
  });

  await ctx.db.Assets.create(assets);

  // Act
  const response = await getAssetsByProgram({
    program,
    assets: assets.map((asset) => asset.id),
    ctx,
  });

  // Assert
  expect(response).toEqual([]);
});

it('Should return an empty array if no assets are provided', async () => {
  // Arrange
  const program = 'programOne';

  const ctx = generateCtx({
    models: {
      Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
    },
  });

  // Act
  const response = await getAssetsByProgram({ program, assets: [], ctx });

  // Assert
  expect(response).toEqual([]);
});
