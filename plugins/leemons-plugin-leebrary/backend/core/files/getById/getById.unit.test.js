const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { getById } = require('./getById');
const { filesSchema } = require('../../../models/files');

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

it('Should retrieve a file by its ID from the database', async () => {
  // Arrange
  const file = {
    id: 'fileOneId',
    uri: 'uri',
    name: 'fileOne',
    extension: '.png',
    type: 'type',
    provider: 'leebrary',
  };
  const fileMetadata = {
    ...file,
    id: 'fileTwoId',
    metadata: JSON.stringify({ metaParam: 422 }),
    name: 'fileTwo',
  };

  const ctx = generateCtx({
    models: {
      Files: newModel(mongooseConnection, 'Files', filesSchema),
    },
  });

  const initialValues = [{ ...file }, { ...fileMetadata }];
  await ctx.db.Files.create(initialValues);

  // Act
  const response = await getById({ id: file.id, ctx });
  const responseMetadata = await getById({ id: fileMetadata.id, ctx });
  const responseNull = await getById({ id: 'notExistentFile', ctx });

  // Assert
  expect(response.id).toEqual(file.id);
  expect(responseMetadata.id).toEqual(fileMetadata.id);
  expect(responseMetadata.metadata).toEqual(JSON.parse(fileMetadata.metadata || null));
  expect(responseNull).toBe(null);
});
