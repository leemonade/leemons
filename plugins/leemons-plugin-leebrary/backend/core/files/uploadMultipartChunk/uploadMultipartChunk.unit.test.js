const { it, expect, describe, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const fs = require('fs/promises');
const { uploadMultipartChunk } = require('./uploadMultipartChunk');
const { filesSchema } = require('../../../models');
const { getByName } = require('../../providers/getByName');
const getProviders = require('../../../__fixtures__/getProviders');
const getFile = require('../../../__fixtures__/getFile');

jest.mock('../../providers/getByName');
jest.mock('fs/promises');

let mongooseConnection;
let disconnectMongoose;

describe('Upload Multipart Chunk', () => {
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
    getByName.mockClear();
    fs.readFile.mockClear();
    fs.appendFile.mockClear();
  });

  it('Should correctly handle upload multipart for non-sys provider', async () => {
    // Arrange
    const ctx = generateCtx({
      models: {
        Files: newModel(mongooseConnection, 'Files', filesSchema),
      },
    });
    ctx.tx.call = jest.fn(); // Mock ctx.call

    const { provider } = getProviders();
    getByName.mockResolvedValue(provider.value.params);
    const { file, buffer } = getFile();
    file.provider = provider.value.pluginName;

    const partNumber = 1;
    const chunk = { path: 'test-path' };
    const path = 'test-path';

    // Mock fsPromises.readFile to resolve a Buffer
    fs.readFile = jest.fn().mockResolvedValue(buffer);

    // Populate "Files" record in db
    await ctx.tx.db.Files.create(file);
    const newFile = await ctx.tx.db.Files.findOne({ id: file.id }).lean();

    // Act
    await uploadMultipartChunk({ fileId: file.id, partNumber, chunk, path, ctx });

    // Assert
    expect(getByName).toHaveBeenCalledWith({ name: file.provider, ctx });
    expect(ctx.tx.call).toHaveBeenCalledWith(`${file.provider}.files.uploadMultipartChunk`, {
      file: newFile,
      partNumber,
      buffer,
      path,
    });
  });

  it('Should correctly handle upload multipart for sys provider and isFolder is true', async () => {
    // Arrange
    const ctx = generateCtx({
      models: {
        Files: newModel(mongooseConnection, 'Files', filesSchema),
      },
    });
    const { file, buffer } = getFile();
    file.provider = 'sys';
    file.isFolder = true;

    const partNumber = 1;
    const chunk = { path: 'test-path' };
    const path = 'test-path';

    // Mock fsPromises.readFile to resolve a Buffer
    fs.readFile = jest.fn().mockResolvedValue(buffer);

    // Populate "Files" record in db
    await ctx.tx.db.Files.create(file);

    // Act
    await uploadMultipartChunk({ fileId: file.id, partNumber, chunk, path, ctx });

    // Assert
    expect(fs.appendFile).toHaveBeenCalledWith(`${file.uri}/${path}`, buffer);
  });

  it('Should correctly handle upload multipart for sys provider and isFolder is false', async () => {
    // Arrange
    const ctx = generateCtx({
      models: {
        Files: newModel(mongooseConnection, 'Files', filesSchema),
      },
    });
    const { file, buffer } = getFile();
    file.provider = 'sys';

    const partNumber = 1;
    const chunk = { path: 'test-path' };
    const path = 'test-path';

    // Mock fsPromises.readFile to resolve a Buffer
    fs.readFile = jest.fn().mockResolvedValue(buffer);

    // Populate "Files" record in db
    await ctx.tx.db.Files.create(file);

    // Act
    await uploadMultipartChunk({ fileId: file.id, partNumber, chunk, path, ctx });

    // Assert
    expect(fs.appendFile).toHaveBeenCalledWith(file.uri, buffer);
  });

  it('Should throw an error when there is no file in the database', async () => {
    // Arrange
    const ctx = generateCtx({
      models: {
        Files: newModel(mongooseConnection, 'Files', filesSchema),
      },
    });

    const partNumber = 1;
    const chunk = { path: 'test-path' };
    const path = 'test-path';
    const fileId = 'nonexistent-file-id';

    // Act and Assert
    await expect(uploadMultipartChunk({ fileId, partNumber, chunk, path, ctx })).rejects.toThrow();
  });
});
