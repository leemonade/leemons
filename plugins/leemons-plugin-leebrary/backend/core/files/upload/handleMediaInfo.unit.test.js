const {
  it,
  expect,
  beforeEach,
  jest: { spyOn, fn },
} = require('@jest/globals');
const { LeemonsError } = require('@leemons/error');
const { generateCtx } = require('@leemons/testing');
const { default: mediainfoAlias } = require('mediainfo.js');

const { handleMediaInfo } = require('./handleMediaInfo');
const { getReadableDuration } = require('./getReadableDuration');
const { getReadableBitrate } = require('./getReadableBitrate');
const { getMetaProps } = require('./getMetaProps');

// MOCKS
jest.mock('@leemons/error');
jest.mock('./getReadableDuration');
jest.mock('./getReadableBitrate');
jest.mock('./getMetaProps');
jest.mock('mediainfo.js');

const mockMediaInfoResult = {
  media: { track: [{ BitRate: '128000', Duration: '10', Type: 'Audio' }] },
};
const mediainfo = {
  analyzeData: fn(async (_, handler) => {
    // Call handler with dummy size and offset
    await handler(500, 0);
    return JSON.stringify(mockMediaInfoResult);
  }),
  close: fn(),
};
mediainfoAlias.mockResolvedValue({ ...mediainfo });

beforeEach(() => {
  getReadableDuration.mockReset();
  getReadableBitrate.mockReset();
  getMetaProps.mockReset();
  // the mediainfoAlias mock is not reset as it defines a global variable in the test file.
});

it('should not throw a leemons error if no file size is provided, catch the error and inform about it', async () => {
  // Arrange
  const params = {
    metadata: {},
    fileHandle: { read: () => {}, close: () => {} },
    fileType: 'image',
    fileSize: null,
    ctx: {},
  };
  const ctx = generateCtx({});
  const spyErrorLog = spyOn(ctx.logger, 'error');
  const spyInfoLog = spyOn(ctx.logger, 'info');

  // Act
  const response = await handleMediaInfo({ ...params, ctx });

  // Assert
  expect(spyErrorLog).toBeCalled();
  expect(spyInfoLog).toBeCalledWith(expect.any(LeemonsError));
  expect(response).toEqual(params.metadata);
});

it('should return metadata for audio file', async () => {
  // Arrange
  const params = {
    metadata: {},
    fileHandle: { read: fn(), close: () => {} },
    fileType: 'audio',
    fileSize: 500,
  };

  const ctx = generateCtx({});
  const spyErrorLog = spyOn(ctx.logger, 'error');
  const mockMetadata = { duration: '10', bitrate: '128000' };

  getReadableDuration.mockReturnValue('00:00:10');
  getReadableBitrate.mockReturnValue('128kbps');
  getMetaProps.mockReturnValue({ ...mockMetadata });

  // Act
  const response = await handleMediaInfo({ ...params, ctx });

  // Assert
  expect(params.fileHandle.read).toHaveBeenCalled();
  expect(getMetaProps).toBeCalledWith(
    expect.objectContaining({
      data: mockMediaInfoResult.media.track[0],
      result: params.metadata,
    })
  );
  expect(getReadableBitrate).toBeCalledWith(Number(mockMetadata.bitrate));
  expect(getReadableDuration).toBeCalledWith({ duration: Number(mockMetadata.duration) * 1000 });
  expect(spyErrorLog).not.toBeCalled();
  expect(response).toEqual({ duration: '00:00:10', bitrate: '128kbps' });
});

it('should return metadata for image file', async () => {
  // Arrange
  const params = {
    metadata: {},
    fileHandle: { read: fn(), close: () => {} },
    fileType: 'image',
    fileSize: 500,
  };

  const ctx = generateCtx({});
  const mockMetadata = { width: '500', height: '500' };

  getMetaProps.mockReturnValue({ ...mockMetadata });

  // Act
  const response = await handleMediaInfo({ ...params, ctx });

  // Assert
  expect(params.fileHandle.read).toHaveBeenCalled();
  expect(getMetaProps).toBeCalledWith(
    expect.objectContaining({
      data: mockMediaInfoResult.media.track[0],
      result: params.metadata,
    })
  );
  expect(getReadableBitrate).not.toBeCalledWith();
  expect(getReadableDuration).not.toBeCalled();
  expect(response).toEqual(mockMetadata);
});

it('should close fileHandle and mediainfo after processing', async () => {
  const fileHandle = { close: fn() };
  const params = {
    metadata: {},

    fileType: 'image',
    fileSize: 500,
  };
  const ctx = generateCtx({});

  await handleMediaInfo({ ...params, ctx });

  expect(fileHandle.close).not.toHaveBeenCalled();
  expect(mediainfo.close).toHaveBeenCalled();
});

it('should return metadata unmodified if the fileType is not supported ', async () => {
  // Arrange
  const ctx = generateCtx({});
  // Act
  const response = await handleMediaInfo({ fileType: 'other', ctx });
  // Assert
  expect(response).toEqual({});
});

it('should return metadata for a file which meta info has not been correctly retreived', async () => {
  // Arrange
  delete mockMediaInfoResult.media;
  const params = {
    metadata: {},
    fileHandle: { read: fn(), close: () => {} },
    fileType: 'image',
    fileSize: 500,
  };
  const ctx = generateCtx({});

  // Act
  const response = await handleMediaInfo({ ...params, ctx });

  // Assert
  expect(getMetaProps).not.toHaveBeenCalled();
  expect(response).toEqual({});
});
