const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { isPlainObject } = require('lodash');

const { getByType } = require('./getByType');
const { filesSchema } = require('../../../models/files');
const getMediaFileData = require('../../../__fixtures__/getMediaFileData');

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

const { imageFile } = getMediaFileData();

it('Should return files by type', async () => {
  // Arrange
  const file1 = {
    ...imageFile,
    metadata: JSON.stringify(imageFile.metadata),
    id: 'fileOne',
    type: 'pdf',
  };
  const file2 = { ...file1, id: 'fileTwo', type: 'doc' };

  const ctx = generateCtx({
    models: {
      Files: newModel(mongooseConnection, 'Files', filesSchema),
    },
  });

  const initialValues = [{ ...file1 }, { ...file2 }];
  await ctx.db.Files.create(initialValues);

  // Act
  const response = await getByType({ type: 'pdf', ctx });

  // Assert
  expect(response).toHaveLength(1);
  expect(isPlainObject(response[0])).toBe(true);
  expect(response[0].id).toBe(file1.id);
  expect(response[0].metadata).toEqual(imageFile.metadata);
});

it('Should return empty array if no files of the specified type exist', async () => {
  // Arrange
  const ctx = generateCtx({
    models: {
      Files: newModel(mongooseConnection, 'Files', filesSchema),
    },
  });

  // Act
  const response = await getByType({ type: 'pdf', ctx });

  // Assert
  expect(response).toHaveLength(0);
});
