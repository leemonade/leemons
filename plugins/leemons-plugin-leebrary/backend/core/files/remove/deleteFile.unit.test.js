const {
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  jest: { fn, spyOn },
} = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const fs = require('fs/promises');

const { deleteFile } = require('./deleteFile');
const { assetsFilesSchema } = require('../../../models/assetsFiles');
const { filesSchema } = require('../../../models/files');
const getMediaFileData = require('../../../__fixtures__/getMediaFileData');

// MOCKS
jest.mock('../../providers/getByName');
jest.mock('fs/promises');
const { getByName: getProviderByName } = require('../../providers/getByName');

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

const { imageFile } = getMediaFileData();

it('Should delete files correctly', async () => {
  // Arrange
  const file = { ...imageFile, metadata: JSON.stringify(imageFile.metadata) };
  const asset = { id: 'assetOne', file: file.id };
  const removeAction = fn();
  const provider = { pluginName: imageFile.provider, supportedMethods: { remove: true } };
  const spyFSUnlink = spyOn(fs, 'unlink');

  const ctx = generateCtx({
    actions: {
      [`${file.provider}.files.remove`]: removeAction,
    },
    models: {
      AssetsFiles: newModel(mongooseConnection, 'AssetsFiles', assetsFilesSchema),
      Files: newModel(mongooseConnection, 'Files', filesSchema),
    },
  });

  const initialAssetsFiles = [
    { file: file.id, asset: asset.id },
    { file: 'fileTwo', asset: 'assetTwo' },
  ];
  const initialFiles = [{ ...file }, { ...file, id: 'fileTwo' }];
  await ctx.tx.db.AssetsFiles.create(initialAssetsFiles);
  await ctx.tx.db.Files.create(initialFiles);

  getProviderByName.mockReturnValue(provider);

  // Act
  const response = await deleteFile({ file, assetId: asset.id, ctx });
  const expectedAssetsFiles = await ctx.tx.db.AssetsFiles.find({}).lean();
  const expectedFiles = await ctx.tx.db.Files.find({}).lean();

  // Assert
  expect(getProviderByName).toBeCalledWith({
    name: imageFile.provider,
    ctx,
  });
  expect(removeAction).toBeCalledWith({
    key: imageFile.uri,
    soft: undefined,
  });
  expect(response).toBe(true);
  expect(spyFSUnlink).not.toBeCalled();
  expect(expectedAssetsFiles.length).toBe(1);
  expect(expectedAssetsFiles[0].file).toBe('fileTwo');
  expect(expectedFiles.length).toBe(1);
  expect(expectedFiles[0].id).toBe('fileTwo');
});

it('Should correctly delete system files', async () => {
  // Arrange
  const file = { ...imageFile, metadata: JSON.stringify(imageFile.metadata) };
  const sysFile = { ...file, id: 'sysFile', provider: 'sys' };
  const asset = { id: 'assetOne', file: sysFile.id };
  const removeAction = fn();
  const spyFSUnlink = spyOn(fs, 'unlink');

  const ctx = generateCtx({
    actions: {
      [`${sysFile.provider}.files.remove`]: removeAction,
    },
    models: {
      AssetsFiles: newModel(mongooseConnection, 'AssetsFiles', assetsFilesSchema),
      Files: newModel(mongooseConnection, 'Files', filesSchema),
    },
  });

  const initialAssetsFiles = [
    { file: file.id, asset: asset.id },
    { file: sysFile.id, asset: asset.id },
  ];
  const initialFiles = [{ ...file }, { ...sysFile }];
  await ctx.tx.db.AssetsFiles.create(initialAssetsFiles);
  await ctx.tx.db.Files.create(initialFiles);

  fs.unlink.mockReturnValue(true);

  // Act
  const response = await deleteFile({ file: sysFile, assetId: asset.id, ctx });
  const expectedAssetsFiles = await ctx.tx.db.AssetsFiles.find({}).lean();
  const expectedFiles = await ctx.tx.db.Files.find({}).lean();

  // Assert
  expect(getProviderByName).not.toBeCalled();
  expect(spyFSUnlink).toBeCalledWith(sysFile.uri);
  expect(removeAction).not.toBeCalled();
  expect(response).toBe(true);
  expect(expectedAssetsFiles.length).toBe(1);
  expect(expectedAssetsFiles[0].file).toBe(file.id);
  expect(expectedFiles.length).toBe(1);
  expect(expectedFiles[0].id).toBe(file.id);
});

it("Should not throw if a file's provider is not found or if it does not support the remove action", async () => {
  // Arrange
  const file = { ...imageFile };
  const removeAction = fn();

  const ctx = generateCtx({
    actions: {
      [`${file.provider}.files.remove`]: removeAction,
    },
    models: {
      AssetsFiles: newModel(mongooseConnection, 'AssetsFiles', assetsFilesSchema),
      Files: newModel(mongooseConnection, 'Files', filesSchema),
    },
  });

  getProviderByName.mockReturnValue(undefined);

  // Act
  const response = await deleteFile({ file, ctx });

  // Assert
  expect(getProviderByName).toBeCalledWith({
    name: imageFile.provider,
    ctx,
  });
  expect(removeAction).not.toBeCalled();
  expect(response).toBe(true);
});
