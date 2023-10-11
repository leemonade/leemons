const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { unlink: unlinkFiles } = require('../../assets/files/unlink');
const { deleteFile } = require('./deleteFile');
const { filesSchema } = require('../../../models/files');
const { remove } = require('./remove');

jest.mock('../../assets/files/unlink');
jest.mock('./deleteFile');

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
  jest.resetAllMocks();
});

it('Should remove files correctly', async () => {
  // Arrange
  const file = {
    id: 'fileOne',
    provider: 'provOne',
    type: 'typeOne',
    extension: 'extOne',
    name: 'nameOne',
    size: 1,
    uri: 'uriOne',
    isFolder: false,
    metadata: 'metaOne',
  };
  const ctx = generateCtx({
    models: {
      Files: newModel(mongooseConnection, 'Files', filesSchema),
    },
  });

  const initialValues = [
    { ...file },
    {
      id: 'fileTwo',
      provider: 'provTwo',
      type: 'typeTwo',
      extension: 'extTwo',
      name: 'nameTwo',
      size: 2,
      uri: 'uriTwo',
      isFolder: true,
      metadata: 'metaTwo',
    },
  ];
  await ctx.tx.db.Files.create(initialValues);

  unlinkFiles.mockResolvedValue(true);
  deleteFile.mockImplementation(() => Promise.resolve(true));

  // Act
  const fileOneAfterDB = await ctx.tx.db.Files.findOne({ id: [file.id] }).lean();
  const response = await remove({ fileIds: [file.id], assetId: 'assetOne', soft: false, ctx });

  // Assert
  expect(response).toBe(1);
  expect(unlinkFiles).toBeCalledWith({
    fileIds: [file.id],
    assetId: 'assetOne',
    soft: false,
    ctx,
  });
  expect(deleteFile).toBeCalledTimes(1);
  expect(deleteFile).toBeCalledWith({
    file: { ...fileOneAfterDB },
    assetId: 'assetOne',
    soft: false,
    ctx,
  });
});
