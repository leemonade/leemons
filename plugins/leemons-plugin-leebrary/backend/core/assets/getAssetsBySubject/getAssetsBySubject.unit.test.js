const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { getAssetsBySubject } = require('./getAssetsBySubject');
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

it('Should filter a set of asset IDs by a given subject', async () => {
  // Arrange
  const assetSubjectOne = { id: 'assetSubjectOne', asset: 'assetOne', subject: 'subjectOne' };
  const assetSubjectTwo = { id: 'assetSubjectTwo', asset: 'assetTwo', subject: 'subjectOne' };
  const assetSubjectThree = { id: 'assetSubjectThree', asset: 'assetThree', subject: 'subjectTwo' };
  const assetSubjectFour = { id: 'assetSubjectFour', asset: 'assetFour', subject: 'subjectOne' };
  const assets = ['assetOne', 'assetTwo', 'assetThree', 'assetFour'];

  const ctx = generateCtx({
    models: {
      AssetsSubjects: newModel(
        mongooseConnection,
        // eslint-disable-next-line sonarjs/no-duplicate-string
        'v1::leebrary_AssetsSubjects',
        assetsSubjectsSchema
      ),
    },
  });

  const initialValues = [assetSubjectOne, assetSubjectTwo, assetSubjectThree, assetSubjectFour];
  await ctx.db.AssetsSubjects.create(initialValues);

  // Act
  const response = await getAssetsBySubject({
    subject: 'subjectOne',
    assets,
    ctx,
  });
  const responseSubjectTwo = await getAssetsBySubject({ subject: 'subjectTwo', assets, ctx });

  // Assert
  expect(response).toEqual(expect.arrayContaining(['assetOne', 'assetTwo', 'assetFour']));
  expect(responseSubjectTwo).toEqual(['assetThree']);
});

it('Should return an empty array if no assets are found for a given subject', async () => {
  // Arrange
  const ctx = generateCtx({
    models: {
      AssetsSubjects: newModel(
        mongooseConnection,
        'v1::leebrary_AssetsSubjects',
        assetsSubjectsSchema
      ),
    },
  });

  // Act
  const response = await getAssetsBySubject({ subject: 'subjectOne', assets: ['assetOne'], ctx });

  // Assert
  expect(response).toEqual([]);
});

it('Should return an empty array if no subject is provided', async () => {
  // Arrange
  const assetSubjectOne = { id: 'assetSubjectOne', asset: 'assetOne', subject: 'subjectOne' };
  const assetSubjectTwo = { id: 'assetSubjectTwo', asset: 'assetTwo', subject: 'subjectOne' };
  const ctx = generateCtx({
    models: {
      AssetsSubjects: newModel(
        mongooseConnection,
        'v1::leebrary_AssetsSubjects',
        assetsSubjectsSchema
      ),
    },
  });
  const initialValues = [assetSubjectOne, assetSubjectTwo];
  await ctx.db.AssetsSubjects.create(initialValues);

  // Act
  const response = await getAssetsBySubject({ assets: ['assetOne'], ctx });

  // Assert
  expect(response).toEqual([]);
});

it('Should return an empty array if no assets are provided', async () => {
  // Arrange
  const ctx = generateCtx({
    models: {
      AssetsSubjects: newModel(
        mongooseConnection,
        'v1::leebrary_AssetsSubjects',
        assetsSubjectsSchema
      ),
    },
  });

  // Act
  const response = await getAssetsBySubject({ subject: ['subjectOne'], ctx });

  // Assert
  expect(response).toEqual([]);
});
