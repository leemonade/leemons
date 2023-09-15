const { it, expect, beforeEach } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { fetchAssetFilesByAssets } = require('./fetchAssetFilesByAssets');

// MOCKS
jest.mock('../../assets/files/getByAssets');
const { getByAssets: getFilesByAssets } = require('../../assets/files/getByAssets');

beforeEach(() => jest.resetAllMocks());

it('Should call fetchAssetFilesByAssets correctly', async () => {
  // Arrange
  const ctx = generateCtx({});
  const assets = ['assetOne', 'assetTwo'];
  getFilesByAssets.mockResolvedValue([{ file: 'fileOne' }, { file: 'fileTwo' }]);

  // Act
  const response = await fetchAssetFilesByAssets({ assets, ctx });

  // Assert
  expect(getFilesByAssets).toBeCalledWith({ assetIds: assets, ctx });
  expect(response).toEqual(['fileOne', 'fileTwo']);
});

it('Should call fetchAssetFilesByAssets correctly', async () => {
  // Arrange
  const ctx = generateCtx({});
  const assets = 'assetOne';
  getFilesByAssets.mockResolvedValue([{ file: 'fileOne' }]);

  // Act
  const response = await fetchAssetFilesByAssets({ assets, ctx });

  // Assert
  expect(getFilesByAssets).toBeCalledWith({ assetIds: [assets], ctx });
  expect(response).toEqual(['fileOne']);
});
it('Should return an empty array when assets are empty', async () => {
  // Arrange
  const ctx = generateCtx({});
  const assets = undefined;
  getFilesByAssets.mockResolvedValue([]);

  // Act
  const response = await fetchAssetFilesByAssets({ assets, ctx });

  // Assert
  expect(response).toEqual([]);
  expect(getFilesByAssets).not.toBeCalled();
});
