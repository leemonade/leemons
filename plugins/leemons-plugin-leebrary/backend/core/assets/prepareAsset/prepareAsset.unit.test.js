const { it, expect, beforeEach } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { prepareAsset } = require('./prepareAsset');

jest.mock('./prepareAssetType');
jest.mock('./getFileUrl');
const { prepareAssetType } = require('./prepareAssetType');
const { getFileUrl } = require('./getFileUrl');

beforeEach(() => {
  jest.resetAllMocks();
});

describe('Should prepare the asset correctly', () => {
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

  it('Should get the file url for an asset correctly', async () => {
    // Arrange
    const rawAsset = {
      file: {
        id: 'fileOne',
        provider: 'leemons-aws-s3',
        uri: 'IAmAnUri',
        extension: 'jpg',
        type: 'image',
      },
      public: false,
    };
    const rawBookmarkAsset = { ...rawAsset, url: 'bookmarkUrl' };
    const expectedAsset = {
      ...rawAsset,
      original: rawAsset,
      prepared: true,
      public: false,
      canAccess: [],
      pinneable: true,
      url: 'solvedUrl',
      fileExtension: rawAsset.file.extension,
      fileType: rawAsset.file.type,
    };
    prepareAssetType.mockReturnValue(rawAsset.file.type);
    getFileUrl.mockResolvedValue('solvedUrl');
    const ctx = generateCtx({});

    // Act
    const response = await prepareAsset({ rawAsset, ctx });
    const responseBookmark = await prepareAsset({ rawAsset: rawBookmarkAsset, ctx });

    // Assert
    expect(getFileUrl).toBeCalledWith({
      fileID: rawAsset.file.id,
      provider: rawAsset.file.provider,
      uri: rawAsset.file.uri,
      ctx,
    });
    expect(getFileUrl).toBeCalledTimes(1);
    expect(response).toEqual(expectedAsset);
    expect(responseBookmark.url).toEqual(rawBookmarkAsset.url);
    expect(responseBookmark).toEqual({
      ...expectedAsset,
      url: rawBookmarkAsset.url,
      original: rawBookmarkAsset,
    });
  });

  it('Should resolve the fileType and fileExtension properties correctly', async () => {
    // Arrange
    const fileExtension = 'jpg';
    const mediaFileType = 'image';
    const rawAsset = {
      file: {
        id: 'fileOne',
        provider: 'leemons-aws-s3',
        uri: 'IAmAnUri',
        extension: fileExtension,
        type: mediaFileType,
      },
      public: false,
    };
    const rawBookmarkAsset = { ...rawAsset, fileType: 'bookmark' };
    const expectedMediaAsset = {
      ...rawAsset,
      original: rawAsset,
      prepared: true,
      public: false,
      canAccess: [],
      pinneable: true,
      url: 'resolvedUrl',
      fileExtension,
      fileType: mediaFileType,
    };
    prepareAssetType.mockReturnValue('image');
    getFileUrl.mockResolvedValue(expectedMediaAsset.url);
    const ctx = generateCtx({});

    // Act
    const response = await prepareAsset({ rawAsset, ctx });
    const responseBookmark = await prepareAsset({ rawAsset: rawBookmarkAsset, ctx });

    // Assert
    expect(response).toEqual(expectedMediaAsset);
    expect(prepareAssetType).toBeCalledTimes(1);
    expect(prepareAssetType).toBeCalledWith(mediaFileType, false);
    expect(responseBookmark).toEqual({
      ...expectedMediaAsset,
      fileType: 'bookmark',
      original: rawBookmarkAsset,
    });
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

  it('Should handle all possible outcomes of the asset cover', async () => {
    // Arrange
    const coverObjectAsset = {
      cover: {
        id: 'coverId',
        provider: 'coverProvider',
        uri: 'coverUri',
      },
    };
    const fileCoverAsset = { cover: new File([''], 'filename') };
    const stringCoverAsset = { cover: 'coverString' };
    const wrongCoverAsset = { cover: 88 };
    const ctx = generateCtx({});
    getFileUrl.mockResolvedValue('coverUrl');

    // Act
    const responseCoverObject = await prepareAsset({ rawAsset: coverObjectAsset, ctx });
    const responseFileCover = await prepareAsset({ rawAsset: fileCoverAsset, ctx });
    const responseStringCover = await prepareAsset({ rawAsset: stringCoverAsset, ctx });
    const responseWrongCover = await prepareAsset({ rawAsset: wrongCoverAsset, ctx });

    // Assert
    expect(getFileUrl).nthCalledWith(1, {
      fileID: coverObjectAsset.cover.id,
      provider: coverObjectAsset.cover.provider,
      uri: coverObjectAsset.cover.uri,
      ctx,
    });
    expect(responseCoverObject.cover).toBe('coverUrl');
    expect(responseFileCover.cover).toEqual(expect.any(String));
    expect(responseStringCover.cover).toBe('coverUrl');
    expect(getFileUrl).nthCalledWith(2, {
      fileID: stringCoverAsset.cover,
      ctx,
    });
    expect(responseWrongCover.cover).toBe(wrongCoverAsset.cover);
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
});
