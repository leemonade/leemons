const {
  expect,
  it,
  beforeEach,
  jest: { fn },
} = require('@jest/globals');
const mime = require('mime-types');
const got = require('got');
const temp = require('temp');

const { download } = require('./download');
const { getOptimizedImage } = require('./getOptimizedImage');
const { getRemoteContentType } = require('./getRemoteContentType');

jest.mock('got');
jest.mock('mime-types');
jest.mock('temp');
jest.mock('./getOptimizedImage');
jest.mock('./getRemoteContentType');

beforeEach(() => jest.resetAllMocks());

const url = 'http://example.com/file.jpg';
const mockMimeExtension = 'image/jpeg';
const mockTempPath = '/fake-tmp/file.jpg';

it('should download a file successfully', async () => {
  // Arrange
  const mockGotOn = fn();
  const mockGotPipe = fn();
  got.mockReturnValue({ on: mockGotOn, pipe: mockGotPipe });
  mime.extension.mockReturnValue('jpeg');

  const mockTempEnd = fn();
  const mockTempOn = fn((event, handler) => {
    if (event === 'finish') {
      handler();
    }
    return { on: mockTempOn };
  });
  temp.createWriteStream.mockImplementation(() => ({
    on: mockTempOn,
    end: mockTempEnd,
    path: mockTempPath,
  }));
  getRemoteContentType.mockResolvedValue(mockMimeExtension);

  // Act
  const result = await download({ url, compress: false });

  // Assert
  expect(got).toHaveBeenCalledWith(url, { isStream: true });
  expect(temp.createWriteStream).toHaveBeenCalled();
  expect(getRemoteContentType).toHaveBeenCalledWith(url);
  expect(mime.extension).toHaveBeenCalledWith(mockMimeExtension);
  expect(mockTempOn).toBeCalledTimes(2);
  expect(mockTempEnd).toBeCalledTimes(1);
  expect(mockGotOn).toHaveBeenCalledTimes(1);
  expect(mockGotPipe).toBeCalledWith({
    on: mockTempOn,
    end: mockTempEnd,
    path: mockTempPath,
  });
  expect(getOptimizedImage).not.toHaveBeenCalled();
  expect(result).toEqual({
    stream: {
      on: mockTempOn,
      end: mockTempEnd,
      path: mockTempPath,
    },
    path: mockTempPath,
    contentType: mockMimeExtension,
  });
});

it('should compress an image file successfully', async () => {
  // Arrange
  const compress = true;
  const mockGotOn = fn();

  const mockGotPipe = fn().mockReturnThis();
  got.mockReturnValue({ on: mockGotOn, pipe: mockGotPipe });
  mime.extension.mockReturnValue('jpeg');

  const mockTempEnd = fn();
  const mockTempOn = fn((event, handler) => {
    if (event === 'finish') {
      handler();
    }
    return { on: mockTempOn };
  });
  temp.createWriteStream.mockImplementation(() => ({
    on: mockTempOn,
    end: mockTempEnd,
    path: mockTempPath,
  }));
  getRemoteContentType.mockResolvedValue(mockMimeExtension);
  getOptimizedImage.mockReturnValue({ path: mockTempPath, extension: 'jpeg' });

  // Act
  await download({ url, compress });

  // Assert
  expect(getOptimizedImage).toHaveBeenCalledWith({ path: null, extension: 'jpeg' });
  expect(mockGotPipe).toBeCalledTimes(2);
});

it('should handle download error', async () => {
  // Arrange
  const compress = false;
  const error = new Error('Download error');
  const mockGotOn = fn((event, handler) => {
    if (event === 'error') {
      handler(error);
    }
    return { on: mockGotOn };
  });
  const mockGotPipe = fn();
  got.mockReturnValue({ on: mockGotOn, pipe: mockGotPipe });
  mime.extension.mockReturnValue('jpeg');

  const mockTempEnd = fn();
  const mockTempOn = fn();
  temp.createWriteStream.mockImplementation(() => ({
    on: mockTempOn,
    end: mockTempEnd,
    path: mockTempPath,
  }));
  getRemoteContentType.mockResolvedValue(mockMimeExtension);

  // Act and Assert
  await expect(download({ url, compress })).rejects.toEqual(error);
});

it('should handle file write error', async () => {
  // Arrange
  const compress = false;
  const error = new Error('File write error');
  const mockGotOn = fn();
  const mockGotPipe = fn();
  got.mockReturnValue({ on: mockGotOn, pipe: mockGotPipe });
  mime.extension.mockReturnValue('jpeg');

  const mockTempEnd = fn();
  const mockTempOn = fn((event, handler) => {
    if (event === 'error') {
      handler(error);
    }
    return { on: mockTempOn };
  });
  temp.createWriteStream.mockImplementation(() => ({
    on: mockTempOn,
    end: mockTempEnd,
    path: mockTempPath,
  }));
  getRemoteContentType.mockResolvedValue(mockMimeExtension);

  // Act and Assert
  await expect(download({ url, compress })).rejects.toEqual(error);
});
