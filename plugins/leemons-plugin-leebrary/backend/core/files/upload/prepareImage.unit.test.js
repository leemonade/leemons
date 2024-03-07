const {
  it,
  expect,
  beforeEach,
  jest: { fn },
} = require('@jest/globals');
const temp = require('temp');

const { prepareImage } = require('./prepareImage');
const { getOptimizedImage } = require('./getOptimizedImage');

jest.mock('temp');
jest.mock('./getOptimizedImage');

beforeEach(() => jest.resetAllMocks());

it('should create a temporary file from an image and optimize it', async () => {
  // Arrange
  const mockPath = 'mockPath';
  const mockExtension = 'mockExtension';
  const mockCtx = { logger: { error: fn() } };
  const mockFileWriterStream = {
    path: 'mockPath',
    on: fn((event, handler) => {
      if (event === 'finish') handler();
      return mockFileWriterStream;
    }),
    pipe: fn(),
  };
  temp.createWriteStream.mockReturnValue(mockFileWriterStream);
  getOptimizedImage.mockReturnValue({ pipe: fn() });

  // Act
  const result = await prepareImage({ path: mockPath, extension: mockExtension, ctx: mockCtx });

  // Assert
  expect(result).toEqual({ path: mockFileWriterStream.path });
  expect(temp.createWriteStream).toHaveBeenCalled();
  expect(getOptimizedImage).toHaveBeenCalledWith({ path: mockPath, extension: mockExtension });
  expect(mockFileWriterStream.on).toHaveBeenCalledTimes(2);
  expect(mockFileWriterStream.on).toHaveBeenCalledWith('error', expect.any(Function));
  expect(mockFileWriterStream.on).toHaveBeenCalledWith('finish', expect.any(Function));
});

it('should throw an error when an error occurs in creating a temporary file', async () => {
  // Arrange
  const mockPath = 'mockPath';
  const mockExtension = 'mockExtension';
  const mockCtx = { logger: { error: fn() } };
  const mockError = new Error('Error');
  const mockFileWriterStream = {
    path: 'mockPath',
    on: fn().mockImplementationOnce((event, handler) => {
      if (event === 'error') handler(mockError);
      return mockFileWriterStream;
    }),
    pipe: fn(),
  };
  temp.createWriteStream.mockReturnValue(mockFileWriterStream);
  getOptimizedImage.mockReturnValue({ pipe: fn() });

  // Act
  try {
    await prepareImage({ path: mockPath, extension: mockExtension, ctx: mockCtx });
  } catch (error) {
    // Assert
    expect(error).toBe(mockError);
    expect(mockCtx.logger.error).toHaveBeenCalledWith('Error uploading image:', mockError);
  }
});
