const { it, expect, beforeEach } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');
const { handleFileUpload } = require('./handleFileUpload');

// mocks
jest.mock('../../files/helpers/uploadFromSource');
const { uploadFromSource } = require('../../files/helpers/uploadFromSource');
const getMediaFileData = require('../../../__fixtures__/getMediaFileData');

beforeEach(() => jest.resetAllMocks());

const {
  handleFileUploadInputs: { imageFileInput, audioFileInput },
  imageFile: imageFileUploaded,
  audioFile: audioFileUploaded,
} = getMediaFileData();

it('Should handle files without cover', async () => {
  // Arrange
  const expectedValueNoCover = {
    newFile: { ...imageFileUploaded },
    coverFile: { ...imageFileUploaded },
  };

  uploadFromSource.mockResolvedValue({ ...imageFileUploaded });
  const ctx = generateCtx({});

  // Act
  const response = await handleFileUpload({
    file: imageFileInput.file,
    cover: undefined,
    assetName: imageFileInput.assetName,
    ctx,
  });

  // Assert
  expect(response).toEqual(expectedValueNoCover);
  expect(response.newFile).toEqual(response.coverFile);
  expect(uploadFromSource).nthCalledWith(
    1,
    expect.objectContaining({
      source: imageFileInput.file,
      name: imageFileInput.assetName,
      ctx,
    })
  );
});

it('Should handle files with cover', async () => {
  // Arrange
  const expectedValue = {
    newFile: { ...audioFileUploaded },
    coverFile: { ...imageFileUploaded },
  };

  let innerFnTimesCalled = 0;
  uploadFromSource.mockImplementation(() => {
    if (innerFnTimesCalled < 1) {
      innerFnTimesCalled++;
      return { ...audioFileUploaded };
    }
    return { ...imageFileUploaded };
  });
  const ctx = generateCtx({});

  // Act
  const response = await handleFileUpload({
    file: audioFileInput.file,
    cover: audioFileInput.cover,
    assetName: audioFileInput.assetName,
    ctx,
  });

  // Assert
  expect(response).toEqual(expectedValue);
  expect(response.newFile).not.toEqual(response.coverFile);
  expect(uploadFromSource).nthCalledWith(
    1,
    expect.objectContaining({
      source: audioFileInput.file,
      name: audioFileInput.assetName,
      ctx,
    })
  );
  expect(uploadFromSource).nthCalledWith(
    2,
    expect.objectContaining({
      source: audioFileInput.cover,
      name: audioFileInput.assetName,
      ctx,
    })
  );
});

it('Should not throw if unexpected values are returned from the inner functions', async () => {
  uploadFromSource.mockResolvedValue(undefined);
  const ctx = generateCtx({});

  // Act
  const testFn = async () =>
    handleFileUpload({
      file: imageFileInput.file,
      cover: imageFileInput.cover,
      assetName: imageFileInput.assetName,
      ctx,
    });

  expect(testFn).not.toThrow();
});

it('Should return null values if no file or cover are passed without trying to upload them', async () => {
  // Arrange
  const ctx = generateCtx({});

  // Act
  const response = await handleFileUpload({ assetName: 'asset', ctx });

  // Assert
  expect(response).toEqual({ newFile: null, coverFile: null });
  expect(uploadFromSource).not.toBeCalled();
});
