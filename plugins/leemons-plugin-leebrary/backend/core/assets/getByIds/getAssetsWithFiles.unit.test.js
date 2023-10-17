const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { find: findBookmarks } = require('../../bookmarks/find');
const { getAssetsWithFiles } = require('./getAssetsWithFiles');
const { assetsFilesSchema } = require('../../../models/assetsFiles');
const { filesSchema } = require('../../../models/files');

jest.mock('../../bookmarks/find');

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

it('Should return assets with their associated files and bookmarks', async () => {
  // Arrange
  const assets = [
    { id: 'assetOne', cover: 'coverOne' },
    { id: 'assetTwo', cover: 'coverTwo' },
  ];
  const assetsIds = assets.map((asset) => asset.id);

  const ctx = generateCtx({
    models: {
      AssetsFiles: newModel(mongooseConnection, 'AssetsFiles', assetsFilesSchema),
      Files: newModel(mongooseConnection, 'Files', filesSchema),
    },
  });

  const initialValuesAssetsFiles = [
    { asset: 'assetOne', file: 'fileOne' },
    { asset: 'assetTwo', file: 'coverTwo' },
  ];
  await ctx.db.AssetsFiles.create(initialValuesAssetsFiles);

  const initialValuesFiles = [
    {
      id: 'fileOne',
      name: 'fileOne',
      provider: 'providerOne',
      type: 'typeOne',
      extension: 'extOne',
      size: 100,
      uri: 'uriOne',
    },
    {
      id: 'coverOne',
      name: 'coverOne',
      provider: 'providerOne',
      type: 'typeOne',
      extension: 'extOne',
      size: 200,
      uri: 'uriOne',
    },
    {
      id: 'coverTwo',
      name: 'coverTwo',
      provider: 'providerTwo',
      type: 'typeTwo',
      extension: 'extTwo',
      size: 200,
      uri: 'uriTwo',
    },
  ];
  await ctx.db.Files.create(initialValuesFiles);

  const bookmarks = [
    { asset: 'assetOne', icon: 'iconOne', url: 'urlOne' },
    { asset: 'assetTwo', icon: 'iconTwo', url: 'urlTwo' },
  ];
  findBookmarks.mockResolvedValue(bookmarks);

  // Act
  const response = await getAssetsWithFiles({ assets, assetsIds, ctx });

  // Assert
  expect(response[0].file.name).toBe('fileOne');
  expect(response[1].file.name).toBe('coverTwo');
  expect(findBookmarks).toHaveBeenCalledWith({ query: { asset: assetsIds }, ctx });
});

it('Should return assets without files if no files are associated', async () => {
  // Arrange
  const assets = [
    { id: 'assetOne', cover: 'coverOne' },
    { id: 'assetTwo', cover: 'coverTwo' },
  ];
  const assetsIds = assets.map((asset) => asset.id);

  const ctx = generateCtx({
    models: {
      AssetsFiles: newModel(mongooseConnection, 'AssetsFiles', assetsFilesSchema),
      Files: newModel(mongooseConnection, 'Files', filesSchema),
    },
  });

  const bookmarks = [
    { asset: 'assetOne', icon: 'iconOne', url: 'urlOne' },
    { asset: 'assetTwo', icon: 'iconTwo', url: 'urlTwo' },
  ];
  findBookmarks.mockResolvedValue(bookmarks);

  // Act
  const response = await getAssetsWithFiles({ assets, assetsIds, ctx });

  // Assert
  expect(response[0].file).toBeUndefined();
  expect(response[1].file).toBeUndefined();
  expect(findBookmarks).toHaveBeenCalledWith({ query: { asset: assetsIds }, ctx });
});

it('Should correctly handle asset cover and file assignment', async () => {
  // Arrange
  const assets = [{ id: 'assetOne', cover: 'coverOne' }, { id: 'assetTwo' }];
  const assetsIds = assets.map((asset) => asset.id);

  const ctx = generateCtx({
    models: {
      AssetsFiles: newModel(mongooseConnection, 'AssetsFiles', assetsFilesSchema),
      Files: newModel(mongooseConnection, 'Files', filesSchema),
    },
  });

  const initialValuesAssetsFiles = [
    { asset: 'assetOne', file: 'fileOne' },
    { asset: 'assetOne', file: 'coverOne' },
    { asset: 'assetTwo', file: 'fileTwo' },
  ];
  await ctx.db.AssetsFiles.create(initialValuesAssetsFiles);

  const initialValuesFiles = [
    {
      id: 'fileOne',
      name: 'fileOne',
      provider: 'providerOne',
      type: 'typeOne',
      extension: 'extOne',
      size: 100,
      uri: 'uriOne',
    },
    {
      id: 'fileTwo',
      name: 'fileTwo',
      provider: 'providerTwo',
      type: 'typeTwo',
      extension: 'extTwo',
      size: 200,
      uri: 'uriTwo',
    },
    {
      id: 'fileThree',
      name: 'fileThree',
      provider: 'providerThree',
      type: 'typeThree',
      extension: 'extThree',
      size: 200,
      uri: 'uriThree',
    },
    {
      id: 'coverOne',
      name: 'coverOne',
      provider: 'providerTwo',
      type: 'typeThree',
      extension: 'extTwo',
      size: 200,
      uri: 'uriTwo',
    },
    {
      id: 'coverTwo',
      name: 'coverTwo',
      provider: 'providerTwo',
      type: 'typeThree',
      extension: 'extTwo',
      size: 200,
      uri: 'uriTwo',
    },
  ];
  await ctx.db.Files.create(initialValuesFiles);

  const bookmarks = [];
  findBookmarks.mockResolvedValue(bookmarks);

  // Act
  const response = await getAssetsWithFiles({ assets, assetsIds, ctx });

  // Assert
  /*
  Si...
  asset.file =
    items.length > 1 ? items.filter((item) => item.id !== asset.cover.id)[0] : items[0];
  expect(response[0].file.name).toBe('fileOne');
  */
  expect(response[0].file[0].name).toBe('fileOne');
  expect(response[1].file.name).toBe('fileTwo');
  expect(response[0].cover.name).toBe('coverOne');
  expect(response[1].cover).toBeUndefined();
});
