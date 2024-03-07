const { it, expect, beforeEach } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { fetchAssetFilesByType } = require('./fetchAssetFilesByType');

// MOCKS
jest.mock('../../assets/files/getByFiles');
jest.mock('../getByType/getByType.js');
const { getByType } = require('../getByType/getByType');
const { getByFiles: getAssetsByFiles } = require('../../assets/files/getByFiles');

beforeEach(() => jest.resetAllMocks());

it('Should call fetchAssetFilesByType correctly', async () => {
  // Arrange
  const ctx = generateCtx({});
  const type = 'testType';
  const fileIds = ['fileOne', 'fileTwo'];
  getByType.mockResolvedValue([{ id: 'fileOne' }, { id: 'fileTwo' }]);
  getAssetsByFiles.mockResolvedValue([{ id: 'assetOneId' }, { id: 'assetTwoId' }]);

  // Act
  const response = await fetchAssetFilesByType({ type, fileIds, ctx });

  // Assert
  expect(getByType).toBeCalledWith({ type, files: fileIds, ctx });
  expect(getAssetsByFiles).toBeCalledWith({ fileIds, ctx });
  expect(response).toEqual(expect.arrayContaining([{ id: 'assetOneId' }, { id: 'assetTwoId' }]));
});

it('Should return an empty array when no files are found', async () => {
  // Arrange
  const ctx = generateCtx({});
  const type = 'testType';
  const fileIds = [];
  getByType.mockResolvedValue([]);
  getAssetsByFiles.mockResolvedValue([]);

  // Act
  const response = await fetchAssetFilesByType({ type, fileIds, ctx });

  // Assert
  expect(getAssetsByFiles).toBeCalledWith({ fileIds: [], ctx });
  expect(response).toEqual([]);
});
