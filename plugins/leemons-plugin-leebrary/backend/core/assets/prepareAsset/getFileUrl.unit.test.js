const {
  it,
  expect,
  beforeEach,
  jest: { fn },
} = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { getFileUrl } = require('./getFileUrl');

jest.mock('../../providers/getByName');
const { getByName: getProviderByName } = require('../../providers/getByName');

beforeEach(() => {
  jest.resetAllMocks();
});

const mockFileId = 'fileOne';
const mockUri = 'IAmAnUri';
const mockProvider = {
  supportedMethods: { getReadStream: true },
};

it('Should return a signed url when provider is not sys', async () => {
  // Arrange
  const expectedValue = 'SUCCESS';
  const getReadStream = fn().mockResolvedValue(expectedValue);
  const provider = 'leemons-aws-s3';

  const ctx = generateCtx({
    actions: {
      [`${provider}.files.getReadStream`]: getReadStream,
    },
  });

  getProviderByName.mockResolvedValue(mockProvider);

  // Act
  const response = await getFileUrl({ fileID: mockFileId, provider, uri: mockUri, ctx });

  // Assert
  expect(getReadStream).toBeCalledWith({
    key: mockUri,
    forceStream: false,
  });
  expect(response).toBe(expectedValue);
});

it('Should not try to get a signed url if the file provider does not support getReadStream', async () => {
  // Arrange
  const getReadStream = fn();
  const provider = 'other-provider';
  const ctx = generateCtx({
    actions: {
      [`${provider}.files.getReadStream`]: getReadStream,
    },
  });
  getProviderByName.mockResolvedValue({ supportedMethods: {} });
  const expectedValue = null;

  // Act
  const response = await getFileUrl({ fileID: mockFileId, provider, uri: mockUri, ctx });

  // Assert
  expect(getReadStream).not.toBeCalled();
  expect(response).toBe(expectedValue);
});

it('Should return the file url when provider is sys', async () => {
  // Arrange
  const getReadStream = fn();
  const provider = 'sys';
  const segment = 'segment';

  const ctx = generateCtx({
    actions: {
      [`${provider}.files.getReadStream`]: getReadStream,
    },
  });
  ctx.meta.authorization = ['auth'];
  const authorization = `?authorization=${encodeURIComponent(ctx.meta.authorization)}`;
  const expectedPrivateResult = `http://localhost:8080/api/v1/leebrary/file/${mockFileId}${authorization}`;
  const expectedPublicResult = `http://localhost:8080/api/v1/leebrary/file/public/${mockFileId}`;
  const expectedPrivateWithSegmentResult = `http://localhost:8080/api/v1/leebrary/file/${mockFileId}/${segment}${authorization}`;

  // Act
  const privateResult = await getFileUrl({ fileID: mockFileId, provider, uri: mockUri, ctx });
  const publicResult = await getFileUrl({
    fileID: mockFileId,
    provider,
    uri: mockUri,
    isPublic: true,
    ctx,
  });
  const segmentPrivateResult = await getFileUrl({
    fileID: mockFileId,
    provider,
    segment,
    uri: mockUri,
    ctx,
  });

  // Assert
  expect(getReadStream).not.toBeCalledWith();
  expect(privateResult).toBe(expectedPrivateResult);
  expect(publicResult).toBe(expectedPublicResult);
  expect(segmentPrivateResult).toBe(expectedPrivateWithSegmentResult);
});

it('Should recognize wrong fileIDs or uris already resolved and return accordingly', async () => {
  // Arrange
  const alreadyResolvedUrl = 'http...';
  const ctx = generateCtx({});

  // Act
  const responseWrongId = await getFileUrl({ fileID: {}, ctx });
  const responseResolvedUrl = await getFileUrl({ fileID: alreadyResolvedUrl, ctx });

  // Assert
  expect(responseWrongId).toBe('');
  expect(responseResolvedUrl).toBe(alreadyResolvedUrl);
});
