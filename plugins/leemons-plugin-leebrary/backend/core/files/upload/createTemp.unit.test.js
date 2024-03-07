const { expect, it, beforeEach } = require('@jest/globals');
const { Readable } = require('stream');
const fs = require('fs');
const temp = require('temp');

const { createTemp } = require('./createTemp');

// MOCKS
jest.mock('temp');
jest.mock('fs');
jest.mock('./isReadableStream');
jest.mock('./streamToBuffer');
const { isReadableStream } = require('./isReadableStream');
const { streamToBuffer } = require('./streamToBuffer');

beforeEach(() => jest.resetAllMocks());

const mockContentType = 'text/plain';
const mockTempFile = { path: '/fake-tmp/leebrary123', fd: 123 };
const bufferText = 'Hello, World!';

it('should create a temporary file from a readable stream', async () => {
  // Arrange
  const mockReadStream = new Readable();
  const mockDataToWrite = Buffer.from(bufferText);
  temp.open.mockImplementation((str, callback) => callback(null, mockTempFile));
  isReadableStream.mockReturnValue(true);
  streamToBuffer.mockResolvedValue(mockDataToWrite);
  fs.write.mockImplementation((fd, buffer, callback) => callback(null));
  fs.close.mockImplementation((fd, callback) => callback(null));

  // Act
  const result = await createTemp({ readStream: mockReadStream, contentType: mockContentType });

  // Assert
  expect(result).toEqual({ path: mockTempFile.path, contentType: mockContentType });
  expect(temp.open).toHaveBeenCalledWith('leebrary', expect.any(Function));
  expect(isReadableStream).toHaveBeenCalledWith(mockReadStream);
  expect(streamToBuffer).toHaveBeenCalledWith(mockReadStream);
  expect(fs.write).toHaveBeenCalledWith(mockTempFile.fd, mockDataToWrite, expect.any(Function));
  expect(fs.close).toHaveBeenCalledWith(mockTempFile.fd, expect.any(Function));
});

it('should create a temporary file from a buffer', async () => {
  // Arrange
  const mockReadStream = Buffer.from('Hello, World!');
  temp.open.mockImplementation((str, callback) => callback(null, mockTempFile));
  isReadableStream.mockReturnValue(false);
  fs.write.mockImplementation((fd, buffer, callback) => callback(null));
  fs.close.mockImplementation((fd, callback) => callback(null));

  // Act
  const result = await createTemp({ readStream: mockReadStream, contentType: mockContentType });

  // Assert
  expect(result).toEqual({ path: mockTempFile.path, contentType: mockContentType });
  expect(temp.open).toHaveBeenCalledWith('leebrary', expect.any(Function));
  expect(isReadableStream).toHaveBeenCalledWith(mockReadStream);
  expect(fs.write).toHaveBeenCalledWith(mockTempFile.fd, mockReadStream, expect.any(Function));
  expect(fs.close).toHaveBeenCalledWith(mockTempFile.fd, expect.any(Function));
});

it('should reject if temp.open fails', async () => {
  // Arrange
  const mockReadStream = new Readable();
  const mockError = new Error('temp.open failed');
  temp.open.mockImplementation((str, callback) => callback(mockError, mockTempFile));

  // Act
  const promise = createTemp({ readStream: mockReadStream, contentType: mockContentType });

  // Assert
  await expect(promise).rejects.toThrow(mockError);
});

it('should reject if fs.write fails', async () => {
  // Arrange
  const mockReadStream = new Readable();
  const mockDataToWrite = Buffer.from(bufferText);
  const mockError = new Error('fs.write failed');
  temp.open.mockImplementation((str, callback) => callback(null, mockTempFile));
  isReadableStream.mockReturnValue(true);
  streamToBuffer.mockResolvedValue(mockDataToWrite);
  fs.write.mockImplementation((fd, buffer, callback) => callback(mockError));

  // Act
  const promise = createTemp({ readStream: mockReadStream, contentType: mockContentType });

  // Assert
  await expect(promise).rejects.toThrow(mockError);
});

it('should reject if fs.close fails', async () => {
  // Arrange
  const mockReadStream = new Readable();
  const mockDataToWrite = Buffer.from(bufferText);
  const mockError = new Error('fs.close failed');
  temp.open.mockImplementation((str, callback) => callback(null, mockTempFile));
  isReadableStream.mockReturnValue(true);
  streamToBuffer.mockResolvedValue(mockDataToWrite);
  fs.write.mockImplementation((fd, buffer, callback) => callback(null));
  fs.close.mockImplementation((fd, callback) => callback(mockError));

  // Act
  const promise = createTemp({ readStream: mockReadStream, contentType: mockContentType });

  // Assert
  await expect(promise).rejects.toThrow(mockError);
});
