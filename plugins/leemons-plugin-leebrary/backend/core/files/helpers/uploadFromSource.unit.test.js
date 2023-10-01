const { it, expect, beforeEach } = require('@jest/globals');
const { uploadFromSource } = require('./uploadFromSource');
const {
  upload: uploadFile,
  uploadFromUrl: uploadFileFromUrl,
  uploadFromFileStream: uploadFileFromStream,
  prepareImage,
} = require('../upload');

jest.mock('../upload');

beforeEach(() => {
  jest.resetAllMocks();
});

it('should upload from URL when source is a string', async () => {
  const source = 'http://example.com/image.jpg';
  const name = 'test.jpg';
  const ctx = {};

  uploadFileFromUrl.mockResolvedValue({});

  const result = await uploadFromSource({ source, name, ctx });

  expect(uploadFileFromUrl).toHaveBeenCalledWith({ url: source, name, ctx });
  expect(result).toEqual({});
});

it('should upload from stream when source is a readable stream', async () => {
  // Arrange
  const source = { readStream: {} };
  const name = 'test.jpg';
  const ctx = {};

  uploadFileFromStream.mockResolvedValue({});

  // Act
  const result = await uploadFromSource({ source, name, ctx });

  // Assert
  expect(uploadFileFromStream).toHaveBeenCalledWith({ file: source, name, ctx });
  expect(result).toEqual({});
});

it('should prepare and upload image when source is a file object with image type', async () => {
  const source = { type: 'image/jpeg', path: '/path/to/image.jpg' };
  const name = 'test.jpg';
  const ctx = {};

  prepareImage.mockResolvedValue({});
  uploadFile.mockResolvedValue({});

  const result = await uploadFromSource({ source, name, ctx });

  expect(prepareImage).toHaveBeenCalledWith({ path: source.path, extension: 'jpeg', ctx });
  expect(uploadFile).toHaveBeenCalled();
  expect(result).toEqual({});
});

it('should upload file when source is a file object with non-image type', async () => {
  const source = { type: 'application/pdf', path: '/path/to/file.pdf' };
  const name = 'test.pdf';
  const ctx = {};

  uploadFile.mockResolvedValue({});

  const result = await uploadFromSource({ source, name, ctx });

  expect(uploadFile).toHaveBeenCalledWith({ file: { ...source }, name, ctx });
  expect(result).toEqual({});
});

it('Should return undefined if source is not a valid value without trying to upload the file', async () => {
  // Arrange
  const source = {};
  const ctx = {};

  // Act
  const response = await uploadFromSource({ source, ctx });

  // Assert
  expect(response).not.toBeDefined();
  expect(uploadFileFromUrl).not.toBeCalled();
  expect(uploadFileFromStream).not.toBeCalled();
  expect(prepareImage).not.toBeCalled();
  expect(uploadFile).not.toBeCalled();
});
