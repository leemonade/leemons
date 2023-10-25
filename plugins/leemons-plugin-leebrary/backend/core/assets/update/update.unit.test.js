const { afterAll, beforeAll, beforeEach, describe, expect, it } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { LeemonsError } = require('@leemons/error');
const { newModel } = require('@leemons/mongodb');

const getAssetAddDataInput = require('../../../__fixtures__/getAssetUpdateDataInput');

const { assetsSchema } = require('../../../models/assets');
const { update } = require('./update');

jest.mock('../../validations/forms');
jest.mock('../../permissions/getByAsset');
const { getByAsset: getPermissions } = require('../../permissions/getByAsset');

jest.mock('../getByIds/getByIds');
const { getByIds } = require('../getByIds/getByIds');

jest.mock('./handleUpdateObject');
const { handleUpdateObject } = require('./handleUpdateObject');

jest.mock('./handleAssetUpgrade');
const { handleAssetUpgrade } = require('./handleAssetUpgrade');

jest.mock('./handleSubjectsUpdates');
const { handleSubjectsUpdates } = require('./handleSubjectsUpdates');

jest.mock('./handleTagsUpdates');
const { handleTagsUpdates } = require('./handleTagsUpdates');

jest.mock('./handleFileAndCoverUpdates');
const { handleFileAndCoverUpdates } = require('./handleFileAndCoverUpdates');

jest.mock('./handleFilesRemoval');
const { handleFilesRemoval } = require('./handleFilesRemoval');

let mongooseConnection;
let disconnectMongoose;
let ctx;
let getVersion;
let publishVersion;

const VERSION_MOCK = {
  uuid: 'd5c4e1ac-18dc-414a-9be7-c7776c524674',
  version: '1.0.0',
  fullId: 'd5c4e1ac-18dc-414a-9be7-c7776c524674@1.0.0',
};

describe('update', () => {
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
    getVersion = jest.fn();
    publishVersion = jest.fn().mockResolvedValue();
    ctx = generateCtx({
      actions: {
        'common.versionControl.getVersion': getVersion,
        'common.versionControl.publishVersion': publishVersion,
      },
      models: {
        Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
      },
    });
    jest.resetAllMocks();
    await mongooseConnection.dropDatabase();
  });

  it('should throw an error if no changes are detected', async () => {
    // Arrange
    const data = {};

    // Act and Assert
    await expect(update({ data, ctx })).rejects.toThrow('No changes detected');
  });

  it('should throw an error if user does not have permissions to update the asset', async () => {
    // Arrange
    const data = { id: 'testAssetId' };

    getPermissions.mockResolvedValue({ permissions: { edit: false } });

    // Act and Assert
    await expect(update({ data, ctx })).rejects.toThrow(
      "You don't have permissions to update this asset"
    );
  });

  it('should throw an error if current asset is not found', async () => {
    // Arrange
    const data = { id: 'testAssetId' };

    getPermissions.mockResolvedValue({ permissions: { edit: true } });
    getByIds.mockResolvedValue([]);
    handleFileAndCoverUpdates.mockResolvedValue({});

    // Act

    // Assert
    await expect(update({ data, ctx })).rejects.toThrow(
      new LeemonsError(ctx, {
        message: 'Asset not found',
        httpStatusCode: 422,
      })
    );
  });

  it('should handle asset update', async () => {
    // Arrange

    const { initialData, assetData, currentAsset, handleUpdateObjectReturn, fileAndCoverUpdates } =
      getAssetAddDataInput();

    await ctx.tx.db.Assets.create({
      ...initialData,
      name: 'initialName',
      category: initialData.category.id,
    });

    getPermissions.mockResolvedValue({ permissions: { edit: true } });
    getByIds.mockResolvedValue([currentAsset]);
    getVersion.mockResolvedValue({
      ...VERSION_MOCK,
      published: false,
    });
    handleUpdateObject.mockResolvedValue(handleUpdateObjectReturn);
    handleFileAndCoverUpdates.mockResolvedValue(fileAndCoverUpdates);

    // Act
    const response = await update({
      data: initialData,
      published: true,
      scale: 'major',
      upgrade: undefined,
      ctx,
    });
    // Assert
    expect(getByIds).toHaveBeenCalledWith({
      ids: initialData.id,
      withFiles: true,
      ctx,
    });
    expect(handleUpdateObject).toHaveBeenCalledWith({
      currentAsset,
      assetData,
      ctx,
    });
    expect(publishVersion).toHaveBeenCalledWith({ id: initialData.id, publish: true });
    expect(handleSubjectsUpdates).toHaveBeenCalledWith({
      assetId: initialData.id,
      subjects: handleUpdateObjectReturn.subjects,
      diff: handleUpdateObjectReturn.diff,
      ctx,
    });
    expect(handleTagsUpdates).toHaveBeenCalledWith({
      assetId: initialData.id,

      updateObject: handleUpdateObjectReturn.updateObject,
      ctx,
    });
    expect(handleFileAndCoverUpdates).toHaveBeenCalledWith({
      assetId: initialData.id,
      assetData,
      updateObject: handleUpdateObjectReturn.updateObject,
      currentAsset,
      fileNeedsUpdate: false,
      coverNeedsUpdate: false,
      ctx,
    });

    expect(handleFilesRemoval).toHaveBeenCalledWith({
      assetId: initialData.id,
      assetData,
      filesToRemove: fileAndCoverUpdates.filesToRemove,
      fileNeedsUpdate: false,
      coverNeedsUpdate: false,
      ctx,
    });
    expect(response.name).toBe('NEW Asset Name');
  });
  it('should handle asset update if there was no changes', async () => {
    // Arrange

    const { initialData, assetData, currentAsset, handleUpdateObjectReturn, fileAndCoverUpdates } =
      getAssetAddDataInput();

    await ctx.tx.db.Assets.create({
      ...initialData,
      category: initialData.category.id,
    });

    getPermissions.mockResolvedValue({ permissions: { edit: true } });
    getByIds.mockResolvedValue([currentAsset]);
    getVersion.mockResolvedValue({
      ...VERSION_MOCK,
      published: false,
    });
    handleUpdateObject.mockResolvedValue({ ...handleUpdateObjectReturn, diff: [] });
    handleFileAndCoverUpdates.mockResolvedValue(fileAndCoverUpdates);

    // Act
    const response = await update({
      data: initialData,
      published: true,
      scale: 'major',
      upgrade: undefined,
      ctx,
    });
    // Assert
    expect(getByIds).toHaveBeenCalledWith({
      ids: initialData.id,
      withFiles: true,
      ctx,
    });
    expect(handleUpdateObject).toHaveBeenCalledWith({
      currentAsset,
      assetData,
      ctx,
    });
    expect(publishVersion).toHaveBeenCalledWith({ id: initialData.id, publish: true });
    expect(handleSubjectsUpdates).toHaveBeenCalledTimes(0);
    expect(handleTagsUpdates).toHaveBeenCalledTimes(0);
    expect(handleFileAndCoverUpdates).toHaveBeenCalledTimes(0);
    expect(handleFilesRemoval).toHaveBeenCalledTimes(0);

    expect(response.name).toBe(currentAsset.name);
  });
  it('should handle asset upgrade when upgrade is true and currentVersion.published is also true', async () => {
    // Arrange
    const { initialData, assetData, currentAsset, handleUpdateObjectReturn, fileAndCoverUpdates } =
      getAssetAddDataInput();

    await ctx.tx.db.Assets.create({
      ...initialData,
      name: 'initialName',
      category: initialData.category.id,
    });

    await ctx.tx.db.Assets.create({
      ...initialData,
      id: 'duplicatedAssetId',
      name: 'initialName',
      category: initialData.category.id,
    });

    const initialAsset = await ctx.tx.db.Assets.findOne({ id: initialData.id });

    getPermissions.mockResolvedValue({ permissions: { edit: true } });
    getByIds.mockResolvedValue([currentAsset]);
    getVersion.mockResolvedValue({
      ...VERSION_MOCK,
      published: true,
    });
    handleUpdateObject.mockResolvedValue(handleUpdateObjectReturn);
    handleFileAndCoverUpdates.mockResolvedValue(fileAndCoverUpdates);
    handleAssetUpgrade.mockResolvedValue({
      id: 'duplicatedAssetId',
    });

    // Act
    const response = await update({
      data: initialData,
      published: true,
      scale: 'major',
      upgrade: true,
      ctx,
    });

    // Assert
    expect(getByIds).toHaveBeenCalledWith({
      ids: initialData.id,
      withFiles: true,
      ctx,
    });
    expect(handleUpdateObject).toHaveBeenCalledWith({
      currentAsset,
      assetData,
      ctx,
    });
    expect(publishVersion).toHaveBeenCalledTimes(0);
    expect(handleSubjectsUpdates).toHaveBeenCalledWith({
      assetId: 'duplicatedAssetId',
      subjects: handleUpdateObjectReturn.subjects,
      diff: handleUpdateObjectReturn.diff,
      ctx,
    });
    expect(handleAssetUpgrade).toHaveBeenCalledWith({
      assetId: initialData.id,
      scale: 'major',
      published: true,
      ctx,
    });
    expect(handleFileAndCoverUpdates).toHaveBeenCalledWith({
      assetId: 'duplicatedAssetId',
      assetData,
      updateObject: handleUpdateObjectReturn.updateObject,
      currentAsset,
      fileNeedsUpdate: false,
      coverNeedsUpdate: false,
      ctx,
    });
    expect(handleFilesRemoval).toHaveBeenCalledWith({
      assetId: initialData.id,
      assetData,
      filesToRemove: fileAndCoverUpdates.filesToRemove,
      fileNeedsUpdate: false,
      coverNeedsUpdate: false,
      ctx,
    });
    expect(response.name).toBe('NEW Asset Name');
    expect(initialAsset.name).toBe('initialName');
  });
});
