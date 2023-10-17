const { it, expect, beforeEach } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { getTypesByAssets } = require('./getTypesByAssets');

// MOCKS
jest.mock('../../assets/files/getByAssets');
jest.mock('../getByIds');
const { getByAssets: getFilesByAssets } = require('../../assets/files/getByAssets');
const { getByIds } = require('../getByIds');

beforeEach(() => jest.resetAllMocks);

it('Should call getTypesByAssets correctly', async () => {
  // Arrange
  const assetIds = ['assetOne', 'assetTwo'];
  const assetFiles = [
    { asset: assetIds[0], file: 'fileOne' },
    { asset: assetIds[1], file: 'fileTwo' },
  ];
  const fileTypes = [
    { type: 'typeOne', id: assetFiles[0].file },
    { type: 'typeOne', id: assetFiles[1].file },
  ];

  const ctx = generateCtx({});
  getFilesByAssets.mockResolvedValue(assetFiles);
  getByIds.mockResolvedValue(fileTypes);

  const expectedValue = ['typeOne'];

  // Act
  const response = await getTypesByAssets({ assetIds, ctx });

  // Assert
  expect(getFilesByAssets).nthCalledWith(1, {
    assetIds,
    ctx,
  });
  expect(getByIds).nthCalledWith(1, {
    fileIds: assetFiles.map((item) => item.file),
    columns: ['type'],
    ctx,
  });
  expect(response).toEqual(expectedValue);
});

it('Should call getTypesByAssets correctly', async () => {
  // Arrange
  const assetId = 'assetOne';
  const assetFiles = [{ asset: assetId, file: 'fileOne' }];
  const fileTypes = [{ type: 'typeOne', id: assetFiles[0].file }];

  const ctx = generateCtx({});
  getFilesByAssets.mockResolvedValue(assetFiles);
  getByIds.mockResolvedValue(fileTypes);

  const expectedValue = ['typeOne'];

  // Act
  const response = await getTypesByAssets({ assetIds: assetId, ctx });

  // Assert
  expect(getFilesByAssets).toBeCalledWith({
    assetIds: [assetId],
    ctx,
  });
  expect(getByIds).toBeCalledWith({
    fileIds: assetFiles.map((item) => item.file),
    columns: ['type'],
    ctx,
  });
  expect(response).toEqual(expectedValue);
});
