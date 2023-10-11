const { it, expect, beforeAll, afterAll, beforeEach, describe } = require('@jest/globals');
const { map } = require('lodash');

const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { sortAssets } = require('./sortAssets');
const { assetsSchema } = require('../../../models/assets');
const getPermissionsMock = require('../../../__fixtures__/getPermissionsMocks');
const getAssets = require('../../../__fixtures__/getAssets');

jest.mock('../../assets/getByIds');
const { getByIds: getAssetsByIds } = require('../../assets/getByIds');

describe('sortAssets', () => {
  const permissionAsset = getPermissionsMock().permissionByAssetOne;
  const asset = getAssets().assetModel;

  let mongooseConnection;
  let disconnectMongoose;
  let ctx;
  let assets;
  let permissionAssets;
  let sortingBy;
  let indexable;
  let showPublic;
  let sortDirection;

  beforeAll(async () => {
    const { mongoose, disconnect } = await createMongooseConnection();
    mongooseConnection = mongoose;
    disconnectMongoose = disconnect;

    ctx = generateCtx({
      models: {
        Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
      },
    });
  });

  afterAll(async () => {
    await disconnectMongoose();

    mongooseConnection = null;
    disconnectMongoose = null;
  });

  beforeEach(async () => {
    await mongooseConnection.dropDatabase();
    jest.resetAllMocks();
    assets = [
      { ...asset, name: 'asset1', id: 'asset1@1.0.0' },
      { ...asset, name: 'asset2', id: 'asset2@2.0.0' },
    ];
    permissionAssets = [
      { ...permissionAsset, asset: 'asset1@1.0.0' },
      { ...permissionAsset, asset: 'asset2@2.0.0' },
    ];
    sortingBy = 'name';
    indexable = true;
    showPublic = true;
    sortDirection = 'asc';
  });

  describe('Intended workload', () => {
    it('should return sorted assets by name', async () => {
      // Arrange
      getAssetsByIds.mockResolvedValue(assets);
      // Act
      const result = await sortAssets({
        sortingBy,
        assets: permissionAssets,
        indexable,
        showPublic,
        sortDirection,
        ctx,
      });
      // Assert
      expect(getAssetsByIds).toBeCalledWith({
        ids: map(permissionAssets, 'asset'),
        withCategory: false,
        withTags: false,
        indexable,
        showPublic,
        ctx,
      });
      expect(result).toEqual(permissionAssets);
    });
  });

  describe('Limit use cases', () => {
    it('should return assets in ascendent order if sortingBy is not provided', async () => {
      // Arrange
      sortingBy = undefined;
      // Act
      const result = await sortAssets({
        sortingBy,
        assets: permissionAssets,
        indexable,
        showPublic,
        sortDirection,
        ctx,
      });
      // Assert
      expect(getAssetsByIds).not.toBeCalled();
      expect(result).toEqual(permissionAssets);
    });
  });

  describe('Additional tests', () => {
    it('should return sorted assets in descending order', async () => {
      // Arrange
      sortingBy = 'name';
      sortDirection = 'desc';
      getAssetsByIds.mockResolvedValue(assets);
      // Act
      const result = await sortAssets({
        sortingBy,
        assets: permissionAssets,
        indexable,
        showPublic,
        sortDirection,
        ctx,
      });
      // Assert
      expect(getAssetsByIds).toBeCalledWith({
        ids: map(permissionAssets, 'asset'),
        withCategory: false,
        withTags: false,
        indexable,
        showPublic,
        ctx,
      });
      expect(result).toEqual(permissionAssets.reverse());
    });
  });
});
