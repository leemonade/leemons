const { it, expect } = require('@jest/globals');
const { uploadFromFileStream } = require('./uploadFromFileStream');
const { createTemp } = require('./createTemp');
const { upload } = require('./upload');

jest.mock('./createTemp');
jest.mock('./upload');

it('should upload file from stream successfully', async () => {
  // Arrange
  const mockFile = { readStream: {}, contentType: 'image/png' };
  const mockName = 'test.png';
  const mockCtx = {};
  const mockPath = '/fake-tmp/test.png';
  const mockFileObject = { uri: '/uploaded/test.png' };

  createTemp.mockResolvedValue({ path: mockPath });
  upload.mockResolvedValue(mockFileObject);

  // Act
  const result = await uploadFromFileStream({ file: mockFile, name: mockName, ctx: mockCtx });

  // Assert
  expect(result).toEqual(mockFileObject);
  expect(createTemp).toHaveBeenCalledWith({
    readStream: mockFile.readStream,
    contentType: mockFile.contentType,
  });
  expect(upload).toHaveBeenCalledWith({
    file: { path: mockPath, type: mockFile.contentType },
    name: mockName,
    ctx: mockCtx,
  });
});

it('should throw error when createTemp fails', async () => {
  // Arrange
  const mockFile = { readStream: {}, contentType: 'image/png' };
  const mockName = 'test.png';
  const mockCtx = {};
  const mockError = new Error('Failed to create temp file');

  createTemp.mockRejectedValue(mockError);

  // Act and Assert
  await expect(
    uploadFromFileStream({ file: mockFile, name: mockName, ctx: mockCtx })
  ).rejects.toThrow(mockError);
  expect(createTemp).toHaveBeenCalledWith({
    readStream: mockFile.readStream,
    contentType: mockFile.contentType,
  });
});

it('should throw error when upload fails', async () => {
  // Arrange
  const mockFile = { readStream: {}, contentType: 'image/png' };
  const mockName = 'test.png';
  const mockCtx = {};
  const mockPath = '/fake-tmp/test.png';
  const mockError = new Error('Failed to upload file');

  createTemp.mockResolvedValue({ path: mockPath });
  upload.mockRejectedValue(mockError);

  // Act and Assert
  await expect(
    uploadFromFileStream({ file: mockFile, name: mockName, ctx: mockCtx })
  ).rejects.toThrow(mockError);
  expect(createTemp).toHaveBeenCalledWith({
    readStream: mockFile.readStream,
    contentType: mockFile.contentType,
  });
  expect(upload).toHaveBeenCalledWith({
    file: { path: mockPath, type: mockFile.contentType },
    name: mockName,
    ctx: mockCtx,
  });
});
