const { it, expect, beforeEach } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { getAssetsByType } = require('./getAssetsByType');

// MOCKS
jest.mock('./fetchAssetFilesByAssets');
const { fetchAssetFilesByAssets } = require('./fetchAssetFilesByAssets');

jest.mock('./fetchAssetFilesByType');
const { fetchAssetFilesByType } = require('./fetchAssetFilesByType');

beforeEach(() => jest.resetAllMocks());

it('Should correctly call its inner functions in orther to fetch assets by type', async () => {
  // Arrange
  const ctx = generateCtx({});
  const type = 'testType';
  const assetsIds = ['assetOne', 'assetTwo'];
  const fileIds = ['fileOne', 'fileTwo'];
  const assetFiles = [{ asset: 'assetOne' }, { asset: 'assetTwo' }];

  fetchAssetFilesByAssets.mockResolvedValue(fileIds);
  fetchAssetFilesByType.mockResolvedValue(assetFiles);

  // Act
  const response = await getAssetsByType({ type, assets: assetsIds, ctx });

  // Assert
  expect(fetchAssetFilesByAssets).toBeCalledWith({ assets: assetsIds, ctx });
  expect(fetchAssetFilesByType).toBeCalledWith({ type, fileIds, ctx });
  expect(response).toEqual(assetsIds);
});

it('Does not catch any error thrown by the inner functions', async () => {
  // Arrange
  const ctx = generateCtx({});
  const type = 'testType';
  const assets = [];

  fetchAssetFilesByAssets.mockImplementation(() => {
    throw new Error('Some error');
  });

  // Act
  const testFnToBreak = async () => getAssetsByType({ type, assets, ctx });

  // Assert
  await expect(testFnToBreak).rejects.toThrow('Some error');
  expect(fetchAssetFilesByAssets).toBeCalled();
  expect(fetchAssetFilesByType).not.toBeCalled();
});
