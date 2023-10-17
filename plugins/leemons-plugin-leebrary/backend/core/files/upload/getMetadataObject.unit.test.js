const { it, expect, beforeEach } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

// MOCKS
jest.mock('./handleMetadata');
jest.mock('./handleDocumentInfo');
jest.mock('./handleMediaInfo');
jest.mock('fs/promises');
const fsPromises = require('fs/promises');
const { handleMetadata } = require('./handleMetadata');
const { handleDocumentInfo } = require('./handleDocumentInfo');
const { handleMediaInfo } = require('./handleMediaInfo');

const { getMetadataObject } = require('./getMetadataObject');

let ctx;
beforeEach(() => {
  jest.resetAllMocks();
  ctx = generateCtx({});
});

it('Should return an object containing metdatadata for a file', async () => {
  // Arrange
  const params = {
    filePath: 'fileURI',
    fileType: 'image/jpeg',
  };
  const handleMetadataResponse = { metadata: { meta: 'meta' }, fileSize: 3000 };
  const handleMediaInfoResponse = { meta: 'meta', data: 'data' };
  const handleDocumentInfoResponse = { doc: 'info' };

  const expectedResult = {
    metadata: handleDocumentInfoResponse,
    fileSize: handleMetadataResponse.fileSize,
  };

  fsPromises.open.mockResolvedValue({ fd: 42 });
  handleMetadata.mockResolvedValue(handleMetadataResponse);
  handleMediaInfo.mockResolvedValue(handleMediaInfoResponse);
  handleDocumentInfo.mockResolvedValue(handleDocumentInfoResponse);

  // Act
  const response = await getMetadataObject({ ...params, ctx });

  // Assert
  expect(response).toEqual(expectedResult);
});
