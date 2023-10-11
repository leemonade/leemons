const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { getAssetsWithSubjects } = require('./getAssetsWithSubjects');
const { assetsSubjectsSchema } = require('../../../models/assetsSubjects');

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

it('Should return assets with their associated subjects', async () => {
  // Arrange
  const assets = [{ id: 'assetOne' }, { id: 'assetTwo' }];
  const assetsIds = assets.map((asset) => asset.id);

  const ctx = generateCtx({
    models: {
      AssetsSubjects: newModel(mongooseConnection, 'AssetsSubjects', assetsSubjectsSchema),
    },
  });

  const initialValues = [
    { asset: 'assetOne', subject: 'subjectOne' },
    { asset: 'assetTwo', subject: 'subjectTwo' },
  ];
  await ctx.db.AssetsSubjects.create(initialValues);

  // Act
  const response = await getAssetsWithSubjects({ assets, assetsIds, ctx });

  // Assert
  expect(response[0].subjects[0].asset).toBe('assetOne');
  expect(response[0].subjects[0].subject).toBe('subjectOne');
  expect(response[1].subjects[0].asset).toBe('assetTwo');
  expect(response[1].subjects[0].subject).toBe('subjectTwo');
});

it('Should return assets without subjects if no subjects are associated', async () => {
  // Arrange
  const assets = [{ id: 'assetOne' }, { id: 'assetTwo' }];
  const assetsIds = assets.map((asset) => asset.id);

  const ctx = generateCtx({
    models: {
      AssetsSubjects: newModel(mongooseConnection, 'AssetsSubjects', assetsSubjectsSchema),
    },
  });

  // Act
  const response = await getAssetsWithSubjects({ assets, assetsIds, ctx });

  // Assert
  expect(response[0].subjects).toBeUndefined();
  expect(response[1].subjects).toBeUndefined();
});
