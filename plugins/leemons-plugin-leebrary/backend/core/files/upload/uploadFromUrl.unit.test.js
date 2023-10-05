const {
  it,
  expect,
  beforeEach,
  jest: { spyOn },
} = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');
const { LeemonsError } = require('@leemons/error');

const { uploadFromUrl } = require('./uploadFromUrl');
const { getById } = require('../getById');
const { dataForReturnFile } = require('../dataForReturnFile');
const { uploadFromFileStream } = require('./uploadFromFileStream');
const { download } = require('./download');
const { upload } = require('./upload');

// MOCKS
jest.mock('../getById');
jest.mock('../dataForReturnFile');
jest.mock('./uploadFromFileStream');
jest.mock('./download');
jest.mock('./upload');

beforeEach(() => jest.resetAllMocks());

it('should upload a file from a URL', async () => {
  // Arrange
  const url = 'http://example.com/file.txt';
  const name = 'file.txt';
  const file = {};
  const downloadedFile = { path: 'path', contentType: 'image/jpg' };
  const ctx = generateCtx({});
  const expetedUploadedFile = { id: 'fileId', isFolder: false };

  getById.mockResolvedValue(file);
  download.mockResolvedValue(downloadedFile);
  upload.mockResolvedValue(expetedUploadedFile);

  // Act
  const result = await uploadFromUrl({ url, name, ctx });

  // Assert
  expect(dataForReturnFile).not.toHaveBeenCalled();
  expect(uploadFromFileStream).not.toHaveBeenCalled();
  expect(getById).toHaveBeenCalledWith({ id: url, ctx });
  expect(download).toHaveBeenCalledWith({ url, compress: true });
  expect(upload).toHaveBeenCalledWith({
    file: { path: downloadedFile.path, type: downloadedFile.contentType },
    name,
    ctx,
  });
  expect(result).toEqual(expetedUploadedFile);
});

it('should identify when a file needs to be uploaded from a file stream and proceed accordingly', async () => {
  // Arrange
  const url = 'fileId';
  const name = 'fileName';
  const file = { id: '123', isFolder: false };
  const fileStream = {};
  const uploadedFile = { id: '123', name: 'file.txt' };
  const ctx = generateCtx({});

  getById.mockResolvedValue(file);
  dataForReturnFile.mockResolvedValue(fileStream);
  uploadFromFileStream.mockResolvedValue(uploadedFile);

  // Act
  const result = await uploadFromUrl({ url, name, ctx });

  // Assert
  expect(result).toEqual(uploadedFile);
  expect(download).not.toHaveBeenCalled();
  expect(getById).toHaveBeenCalledWith({ id: url, ctx });
  expect(dataForReturnFile).toHaveBeenCalledWith({ id: file.id, ctx });
  expect(uploadFromFileStream).toHaveBeenCalledWith({ file: fileStream, name, ctx });
});

it('should identify if the URL is a file ID pointing to a folder and return it unmodified', async () => {
  // Arrange
  const url = 'folderFileId';
  const name = 'fileName';
  const file = { id: '123', isFolder: true };
  const ctx = generateCtx({});

  getById.mockResolvedValue(file);

  // Act
  const result = await uploadFromUrl({ url, name, ctx });

  // Assert
  expect(result).toEqual(file);
  expect(download).not.toHaveBeenCalled();
  expect(getById).toHaveBeenCalledWith({ id: url, ctx });
  expect(dataForReturnFile).not.toHaveBeenCalled();
  expect(uploadFromFileStream).not.toHaveBeenCalled();
});

it('should throw and log an error when the download fails', async () => {
  // Arrange
  const url = 'http://example.com/file.txt';
  const name = 'file.txt';
  const ctx = generateCtx({});
  const spyLogger = spyOn(ctx.logger, 'error');

  getById.mockResolvedValue(null);
  download.mockRejectedValue(new Error());

  // Act
  const testFnToThrow = async () => uploadFromUrl({ url, name, ctx });

  // Assert
  await expect(testFnToThrow).rejects.toThrow(LeemonsError);
  expect(spyLogger).toHaveBeenCalled();
  expect(getById).toHaveBeenCalledWith({ id: url, ctx });
  expect(download).toHaveBeenCalledWith({ url, compress: true });
});
