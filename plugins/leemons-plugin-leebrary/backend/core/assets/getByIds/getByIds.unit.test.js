/* eslint-disable no-param-reassign */
const {
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
  jest: { spyOn },
} = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { getByIds } = require('./getByIds');
const { assetsSchema } = require('../../../models/assets');
const getUserSession = require('../../../__fixtures__/getUserSession');

// MOCKS
jest.mock('./getUserPermissionsByAsset');
jest.mock('./getAssetsWithPermissions');
jest.mock('./getAssetsWithSubjects');
jest.mock('./getAssetsWithFiles');
jest.mock('./getAssetsTags');
jest.mock('./getAssetsCategoryData');
jest.mock('./getAssetsProgramsAggregatedById');
jest.mock('./processFinalAsset');
jest.mock('../../pins/getByAssets');
const { getByAssets: getPins } = require('../../pins/getByAssets');
const { getUserPermissionsByAsset } = require('./getUserPermissionsByAsset');
const { getAssetsWithPermissions } = require('./getAssetsWithPermissions');
const { getAssetsWithSubjects } = require('./getAssetsWithSubjects');
const { getAssetsWithFiles } = require('./getAssetsWithFiles');
const { getAssetsTags } = require('./getAssetsTags');
const { getAssetsCategoryData } = require('./getAssetsCategoryData');
const { getAssetsProgramsAggregatedById } = require('./getAssetsProgramsAggregatedById');
const { processFinalAsset } = require('./processFinalAsset');

// Functions to spy
const buildQueryModule = require('./buildQuery');

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

let spyBuildQuery;

beforeEach(async () => {
  await mongooseConnection.dropDatabase();
  spyBuildQuery = spyOn(buildQueryModule, 'buildQuery');
});

afterEach(() => {
  spyBuildQuery.mockRestore();
  jest.resetAllMocks();
});

const userSession = getUserSession();

it('Should fetch assets by their IDs', async () => {
  // Arrange
  const assets = [{ id: 'assetOne' }, { id: 'assetTwo' }];
  const assetsIds = assets.map((item) => item.id);

  const ctx = generateCtx({
    models: {
      Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
    },
  });
  ctx.meta.userSession = userSession;

  const initialValues = [{ ...assets[0] }, { ...assets[1] }, { id: 'otherAsset' }];
  await ctx.db.Assets.create(initialValues);
  const assetsFromDB = await ctx.db.Assets.find({ id: assetsIds }).lean();
  const assetsWithSubjects = assetsFromDB.map((asset) => ({
    ...asset,
    subjects: ['subjectsArray'],
  }));
  const assetsWithFiles = assetsWithSubjects.map((asset) => ({ ...asset, file: 'fileObjectHere' }));
  const permissionsByAsset = [['permissions'], ['canEditPermissions']];
  const tags = [['leemons'], []];
  const categories = ['categoryObjectsHere'];
  const assetCategoryData = ['assetCategoryDataHere'];
  const programsById = 'Programs by id here';
  const pins = ['pins'];
  const finalAssetsOne = { ...assetsWithFiles[0], tags: tags[0], pinned: true };
  const finalAssetsTwo = { ...assetsWithFiles[1], tags: tags[1], pinned: false };
  let processFinalTimesCalled = 0;

  getUserPermissionsByAsset.mockResolvedValue(permissionsByAsset);
  getAssetsWithPermissions.mockResolvedValue([...assetsFromDB]);
  getAssetsWithSubjects.mockResolvedValue([...assetsWithSubjects]);
  getAssetsWithFiles.mockResolvedValue([...assetsWithFiles]);
  getAssetsTags.mockResolvedValue(tags);
  getAssetsCategoryData.mockResolvedValue([categories, assetCategoryData]);
  getPins.mockResolvedValue(pins);
  getAssetsProgramsAggregatedById.mockResolvedValue(programsById);
  processFinalAsset.mockImplementation(() => {
    processFinalTimesCalled++;
    if (processFinalTimesCalled === 1) return finalAssetsOne;
    return finalAssetsTwo;
  });

  // Act
  const response = await getByIds({
    ids: assets.map((item) => item.id),
    checkPermissions: true,
    withFiles: true,
    ctx,
  });

  // Assert
  expect(getUserPermissionsByAsset).toBeCalledWith({
    assets: assetsFromDB,
    ctx,
  });
  expect(getAssetsWithPermissions).toBeCalledWith({
    assets: assetsFromDB,
    assetsIds,
    showPublic: undefined,
    ctx,
  });
  expect(getAssetsWithSubjects).toBeCalledWith({
    assets: assetsFromDB,
    assetsIds,
    ctx,
  });
  expect(getAssetsWithFiles).toBeCalledWith({
    assets: assetsWithSubjects,
    assetsIds,
    ctx,
  });
  expect(getAssetsTags).toBeCalledWith({
    assets: assetsWithFiles,
    ctx,
  });
  expect(getAssetsCategoryData).toBeCalledWith({
    assets: assetsWithFiles,
    ctx,
  });
  expect(getPins).toBeCalledWith({
    assetsIds,
    ctx,
  });
  expect(getAssetsProgramsAggregatedById).toBeCalledWith({
    assets: assetsWithFiles,
    ctx,
  });
  expect(processFinalAsset).nthCalledWith(1, {
    asset: assetsWithFiles[0],
    programsById,
    permissionsByAsset: permissionsByAsset[0],
    canEditPermissions: permissionsByAsset[1],
    withCategory: true,
    categories,
    assetCategoryData,
    withTags: true,
    tags: tags[0],
    checkPins: true,
    pins,
    userAgents: ctx.meta.userSession?.userAgents?.map(({ id }) => id),
  });
  expect(response).toEqual([finalAssetsOne, finalAssetsTwo]);
});

it('Should check permissions only if userSession is provided and handle falsy flags correctly', async () => {
  // Arrange
  const assets = [{ id: 'assetOne' }, { id: 'assetTwo' }];
  const assetsIds = assets.map((item) => item.id);

  const ctx = generateCtx({
    models: {
      Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
    },
  });
  ctx.meta.userSession = undefined;

  const initialValues = [{ ...assets[0] }, { ...assets[1] }, { id: 'otherAsset' }];
  await ctx.db.Assets.create(initialValues);
  const assetsFromDB = await ctx.db.Assets.find({ id: assetsIds }).lean();

  getUserPermissionsByAsset.mockResolvedValue([[], []]);
  getAssetsWithPermissions.mockResolvedValue([...assetsFromDB]);
  getAssetsWithSubjects.mockResolvedValue([...assetsFromDB]);
  getAssetsWithFiles.mockResolvedValue([...assetsFromDB]);
  getAssetsTags.mockResolvedValue([[], []]);
  getAssetsCategoryData.mockResolvedValue([[], []]);
  getPins.mockResolvedValue([]);
  getAssetsProgramsAggregatedById.mockResolvedValue({});
  let processFinalTimesCalled = 0;
  processFinalAsset.mockImplementation(() => {
    processFinalTimesCalled++;
    if (processFinalTimesCalled === 1) return assetsFromDB[0];
    return assetsFromDB[1];
  });

  // Act
  const response = await getByIds({
    ids: assets.map((item) => item.id),
    checkPermissions: true,
    withFiles: false,
    withSubjects: false,
    withTags: false,
    withCategory: false,
    checkPins: false,
    ctx,
  });

  // Assert
  expect(getUserPermissionsByAsset).toBeCalledWith({
    assets: assetsFromDB,
    ctx,
  });
  expect(getAssetsWithPermissions).not.toBeCalled();
  expect(getAssetsWithSubjects).not.toBeCalled();
  expect(getAssetsWithFiles).not.toBeCalled();
  expect(getAssetsTags).not.toBeCalled();
  expect(getAssetsCategoryData).not.toBeCalled();
  expect(getPins).not.toBeCalled();
  expect(getAssetsProgramsAggregatedById).toBeCalledWith({
    assets: assetsFromDB,
    ctx,
  });
  expect(processFinalAsset).toBeCalledTimes(assets.length);

  expect(response).toEqual(expect.arrayContaining(assetsFromDB));
});

it('Should return empty array if no asset IDs are provided', async () => {
  // Arrange
  const ctx = generateCtx({
    models: {
      Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
    },
  });

  getUserPermissionsByAsset.mockResolvedValue([[], []]);
  getAssetsCategoryData.mockResolvedValue([[], []]);

  // Act
  const result = await getByIds({ ctx });

  // Assert
  expect(getAssetsWithSubjects).not.toBeCalled();
  expect(getAssetsWithFiles).not.toBeCalled();
  expect(result).toEqual([]);
});
