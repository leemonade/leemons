const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const _ = require('lodash');

const { handleSubjects } = require('./handleSubjects');
const { assetsSubjectsSchema } = require('../../../models/assetsSubjects');
const getAssets = require('../../../__fixtures__/getAssets');
const getAssetAddDataInput = require('../../../__fixtures__/getAssetAddDataInput');

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

it('Should correctly create asset subjets in the db and return them as an array of objects', async () => {
  // Arrange
  const { assetModel } = getAssets();
  const { dataInput } = getAssetAddDataInput();

  const ctx = generateCtx({
    models: {
      AssetsSubjects: newModel(mongooseConnection, 'AssetsSubjects', assetsSubjectsSchema),
    },
  });

  // Act
  const response = await handleSubjects({
    subjects: dataInput.subjects,
    assetId: assetModel.id,
    ctx,
  });
  const foundAssetSubject = await ctx.db.AssetsSubjects.findOne({}).lean();

  // Assert
  expect(foundAssetSubject.asset).toEqual(assetModel.id);
  expect(foundAssetSubject.subject).toEqual(dataInput.subjects[0].subject);
  expect(foundAssetSubject.level).toEqual(dataInput.subjects[0].level);
  expect(_.isPlainObject(response[0])).toBe(true);
});
