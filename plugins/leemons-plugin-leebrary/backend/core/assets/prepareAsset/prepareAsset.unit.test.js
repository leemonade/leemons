const {
  it,
  expect,
  beforeEach,
  jest: { fn },
} = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { prepareAsset } = require('./prepareAsset');

jest.mock('./prepareAssetType');
jest.mock('./getFileUrl');
const { prepareAssetType } = require('./prepareAssetType');
const { getFileUrl } = require('./getFileUrl');

beforeEach(() => {
  jest.resetAllMocks();
});

it('Should prepare the asset correctly when asset is not public', async () => {
  // Arrange
  const fileType = 'image';
  const fileExtension = 'jpg';
  const rawAsset = {
    file: {
      id: 'fileOne',
      provider: 'leemons-aws-s3',
      uri: 'IAmAnUri',
      extension: fileExtension,
    },
    public: false,
  };
  const expectedAsset = {
    ...rawAsset,
    original: rawAsset,
    prepared: true,
    public: false,
    canAccess: [],
    pinneable: true,
    fileType,
    url: 'SUCCESS',
    fileExtension,
  };
  prepareAssetType.mockReturnValue(fileType);
  getFileUrl.mockResolvedValue('SUCCESS');
  const ctx = generateCtx({});

  // Act
  const response = await prepareAsset({ rawAsset, ctx });

  // Assert
  expect(getFileUrl).toBeCalledWith({
    fileID: rawAsset.file.id,
    provider: rawAsset.file.provider,
    uri: rawAsset.file.uri,
    ctx,
  });
  expect(response).toEqual(expectedAsset);
});

it('Should prepare the asset correctly when the asset is pinneable or not accordingly to the isPublished param', async () => {
  // Arrange
  const rawAsset = {
    public: false,
  };
  const ctx = generateCtx({});

  // Act and Assert for isPublished = true
  let response = await prepareAsset({ rawAsset, isPublished: true, ctx });
  expect(response.pinneable).toBe(true);

  // Act and Assert for isPublished = false
  response = await prepareAsset({ rawAsset, isPublished: false, ctx });
  expect(response.pinneable).toBe(false);
});

it('Should handle all possible outcomes of the asset cover', async () => {
  // Arrange
  const rawAsset = {
    cover: {
      id: 'coverId',
      provider: 'coverProvider',
      uri: 'coverUri',
    },
  };
  const ctx = generateCtx({});
  getFileUrl.mockResolvedValue('coverUrl');

  // Act
  let response = await prepareAsset({ rawAsset, ctx });

  // Assert
  expect(getFileUrl).toBeCalledWith({
    fileID: rawAsset.cover.id,
    provider: rawAsset.cover.provider,
    uri: rawAsset.cover.uri,
    ctx,
  });
  expect(response.cover).toBe('coverUrl');

  // Arrange
  rawAsset.cover = new File([''], 'filename');
  getFileUrl.mockResolvedValue('coverUrl');

  // Act
  response = await prepareAsset({ rawAsset, ctx });

  // Assert
  expect(response.cover).toEqual(expect.any(String));

  // Arrange
  rawAsset.cover = 'coverString';
  getFileUrl.mockResolvedValue('coverUrl');

  // Act
  response = await prepareAsset({ rawAsset, ctx });

  // Assert
  expect(getFileUrl).toBeCalledWith({ fileID: rawAsset.cover, ctx });
  expect(response.cover).toBe('coverUrl');
});

it('Should handle metadata property when it is an object', async () => {
  // Arrange
  const rawAsset = {
    file: {
      metadata: {
        key1: 'value1',
        key2: 'value2',
      },
    },
  };
  const ctx = generateCtx({});

  // Act
  const response = await prepareAsset({ rawAsset, ctx });

  // Assert
  expect(response.metadata).toEqual([
    { label: 'Key1', value: 'value1' },
    { label: 'Key2', value: 'value2' },
  ]);
});

it('Should handle metadata property when it is a stringified object in file', async () => {
  // Arrange
  const rawAsset = {
    file: {
      metadata: JSON.stringify({
        key3: 'value3',
        key4: 'value4',
      }),
    },
  };
  const ctx = generateCtx({});

  // Act
  const response = await prepareAsset({ rawAsset, ctx });

  // Assert
  expect(response.metadata).toEqual([
    { label: 'Key3', value: 'value3' },
    { label: 'Key4', value: 'value4' },
  ]);
});

it('Should handle metadata property when it is an object in file', async () => {
  // Arrange
  const rawAsset = {
    file: {
      metadata: {
        key5: 'value5',
        key6: 'value6',
      },
    },
  };
  const ctx = generateCtx({});

  // Act
  const response = await prepareAsset({ rawAsset, ctx });

  // Assert
  expect(response.metadata).toEqual([
    { label: 'Key5', value: 'value5' },
    { label: 'Key6', value: 'value6' },
  ]);
});

it('Should handle asset icon correctly', async () => {
  // Arrange
  const rawAsset = {
    icon: {
      id: 'iconId',
      provider: 'iconProvider',
      uri: 'iconUri',
    },
  };
  const ctx = generateCtx({});
  const expectedIconUrl = 'http://example.com/icon';
  getFileUrl.mockResolvedValue(expectedIconUrl);

  // Act
  const response = await prepareAsset({ rawAsset, ctx });
  const responseNoIcon = await prepareAsset({ rawAsset: {}, ctx });

  // Assert
  expect(response.icon).toEqual(expectedIconUrl);
  expect(responseNoIcon.icon).toBeUndefined();
});

it('Should set the canAccess property correctly', async () => {
  // Arrange
  const rawAssetWithAccess = {
    canAccess: [
      { name: 'User1', surnames: 'Surname1' },
      { name: 'User2', surnames: 'Surname2' },
    ],
  };
  const rawAssetWithoutAccess = {
    canAccess: [],
  };
  const ctx = generateCtx({});

  // Act
  const responseWithAccess = await prepareAsset({ rawAsset: rawAssetWithAccess, ctx });
  const responseWithoutAccess = await prepareAsset({ rawAsset: rawAssetWithoutAccess, ctx });

  // Assert
  expect(responseWithAccess.canAccess).toEqual([
    { name: 'User1', surnames: 'Surname1', fullName: 'User1 Surname1' },
    { name: 'User2', surnames: 'Surname2', fullName: 'User2 Surname2' },
  ]);
  expect(responseWithoutAccess.canAccess).toEqual([]);
});
