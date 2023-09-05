const {
  it,
  expect,
  jest: { spyOn },
} = require('@jest/globals');
const { generateCtx } = require('leemons-testing');

const { handleFiles } = require('./handleFiles');
const getMediaFileData = require('../../../__fixtures__/getMediaFileData');
const getAssets = require('../../../__fixtures__/getAssets');

// mocks:
jest.mock('../files/add');
const { add: addFiles } = require('../files/add');

it('Should call the addFiles function with the correct arguments and return true when a correct file id is passed', async () => {
  // Arrange
  const { imageFile: newFile } = getMediaFileData();
  const { assetModel: asset } = getAssets();

  const ctx = generateCtx({});
  addFiles.mockResolvedValue('ok');

  // Act
  const response = await handleFiles({ newFile, assetId: asset.id, ctx });

  // Assert
  expect(addFiles).toBeCalledWith({
    fileId: newFile.id,
    assetId: asset.id,
    skipPermissions: true,
    ctx,
  });
  expect(response).toBe(true);
});
it('Should not throw, instead it returns false and uses ctx.logger to log addFiles() errors if any', async () => {
  // Arrange
  const { imageFile: newFile } = getMediaFileData();
  const { assetModel: asset } = getAssets();
  const wrongFileId = { id: ['88'] };

  const ctx = generateCtx({});
  const spyCtxLogger = spyOn(ctx.logger, 'error');

  // Act
  const responseWithWrongId = await handleFiles({ newFile: wrongFileId, assetId: asset.id, ctx });
  const testWithWrongId = async () => handleFiles({ newFile: wrongFileId, assetId: asset.id, ctx });

  addFiles.mockImplementation(() => {
    throw new Error('Boom!');
  });
  const responseWithError = await handleFiles({ newFile, assetId: asset.id, ctx });

  // Assert
  expect(responseWithWrongId).toBe(false);
  expect(testWithWrongId).not.toThrow();
  expect(spyCtxLogger).toHaveBeenCalledWith(new Error('Boom!'));
  expect(responseWithError).toBe(false);
});
