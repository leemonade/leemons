const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('leemons-testing');
const { newModel } = require('leemons-mongodb');

const { handleCoverDuplication } = require('./handleCoverDuplication');
const { assetsSchema } = require('../../../models/assets');
const getMediaFileData = require('../../../__fixtures__/getMediaFileData');
const getAssets = require('../../../__fixtures__/getAssets');

// MOCKS
jest.mock('../../files/duplicate.js');
const { duplicate: duplicateFile } = require('../../files/duplicate');

let mongooseConnection;
let disconnectMongoose;

beforeAll(async () => {
  const { mongoose, disconnect } = await createMongooseConnection();

  mongooseConnection = mongoose;
  disconnectMongoose = disconnect;
});

afterAll(async () => {
  await disconnectMongoose();

  mongooseConnection = null;
  disconnectMongoose = null;
});

beforeEach(async () => {
  await mongooseConnection.dropDatabase();
});

const { imageFile } = getMediaFileData();
const { bookmarkAsset } = getAssets();

it("Should duplicate the cover file and update the asset's cover reference in the DB", async () => {
  // Arrange
  const newAsset = {
    ...bookmarkAsset,
    name: `${bookmarkAsset.name} (1)`,
    cover: null,
    id: 'newAssetId',
    subjects: undefined,
  };

  const newCover = {
    ...imageFile,
    id: 'newCoverId',
    uri: 'leemons/leebrary/newCoverId.png',
  };
  duplicateFile.mockResolvedValue(newCover);
  const expectedResponse = { ...newAsset, cover: { ...newCover } };

  const ctx = generateCtx({
    models: {
      Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
    },
  });
  await ctx.tx.db.Assets.create({ ...newAsset });

  // Act
  const response = await handleCoverDuplication({ newAsset, cover: imageFile, ctx });
  const updatedAsset = await ctx.tx.db.Assets.findOne({ id: newAsset.id }).lean();

  // Assert
  expect(duplicateFile).toBeCalledWith({
    file: { ...imageFile },
    ctx,
  });
  expect(response).toEqual(expectedResponse);
  expect(updatedAsset.cover).toEqual(newCover.id);
});

it('Shoud not thow if the system cannot duplicate the cover file, instead it should return the passed asset unaffected', async () => {
  // Arrange
  const newAsset = {
    ...bookmarkAsset,
    name: `${bookmarkAsset.name} (1)`,
    cover: null,
    id: 'newAssetId',
    subjects: undefined,
  };
  duplicateFile.mockResolvedValue(undefined);

  const ctx = generateCtx({
    models: {
      Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
    },
  });

  // Act
  const response = await handleCoverDuplication({ newAsset, cover: imageFile, ctx });

  // Assert: unaffected newAsset, does not throw
  expect(response).toEqual({ ...newAsset });
});
