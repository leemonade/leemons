/* eslint-disable no-param-reassign */
const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { getByIds } = require('./getByIds');
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

it('Gets files by their ids filtering by type which should be case insensitive', async () => {
  // Arrange
  const fileIds = ['fileOneId', 'fileTwoId'];
  const type = 'typetwo';
  const ctx = generateCtx({
    models: {
      Files: newModel(mongooseConnection, 'Files', filesSchema),
    },
  });

  const file = {
    ...imageFile,
    metadata: JSON.stringify(imageFile.metadata),
    id: fileIds[0],
    type: 'typeOne',
  };

  const initialValues = [
    { ...file },
    {
      ...file,
      id: fileIds[1],
      type: 'typeTwo',
      name: 'fileTwo',
    },
  ];
  await ctx.db.Files.create(initialValues);
  const expectedResponse = await ctx.db.Files.findOne({
    id: fileIds,
    type: new RegExp(type, 'i'),
  }).lean();

  const columns = ['id', 'metadata'];
  const expectedParsedResponse = [
    { id: fileIds[0], metadata: imageFile.metadata },
    { id: fileIds[1], metadata: imageFile.metadata },
  ];

  // Act
  const response = await getByIds({
    fileIds,
    type,
    parsed: false,
    ctx,
  });
  const parsedResponse = await getByIds({ fileIds, columns, ctx });
  parsedResponse.forEach((item) => delete item._id);

  // Assert
  expect(response).toEqual(expect.arrayContaining([expectedResponse]));
  expect(parsedResponse).toEqual(expect.arrayContaining(expectedParsedResponse));
});
