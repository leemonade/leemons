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
const { download } = require('./download');
const { upload } = require('./upload');

// MOCKS
jest.mock('../getById');
jest.mock('./download');
jest.mock('./upload');

beforeEach(() => jest.resetAllMocks());

it('Should upload a file from a URL', async () => {
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
  expect(getById).toHaveBeenCalledWith({ id: url, ctx });
  expect(download).toHaveBeenCalledWith({ url, compress: true });
  expect(upload).toHaveBeenCalledWith({
    file: { path: downloadedFile.path, type: downloadedFile.contentType },
    name,
    ctx,
  });
  expect(result).toEqual(expetedUploadedFile);
});

it('Identifies when a file must not be uploaded and returns it unmodified', async () => {
  // Arrange
  const url = 'fileId';
  const name = 'fileName';
  const file = { id: '123', isFolder: false };
  const ctx = generateCtx({});

  getById.mockResolvedValue(file);

  // Act
  const result = await uploadFromUrl({ url, name, ctx });

  // Assert
  expect(getById).toHaveBeenCalledWith({ id: url, ctx });
  expect(result).toEqual(file);
  expect(download).not.toHaveBeenCalled();
  expect(upload).not.toHaveBeenCalledWith();
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
