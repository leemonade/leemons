const { it, expect, describe, afterEach } = require('@jest/globals');
const fsPromises = require('fs/promises');
const path = require('path');
const { handleFileSystem } = require('./handleFileSystem');

describe('handleFileSystem', () => {
  const mockFile = {
    id: '123',
    deploymentID: '456',
    provider: 'sys',
    type: 'file',
    extension: 'txt',
    name: 'mockFile',
    size: 0,
    uri: '',
    metadata: '',
    isFolder: false,
  };

  const mockFilePaths = ['path1', 'path2'];

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should handle a non-folder file correctly', async () => {
    // Arrange
    const writeFileSpy = jest.spyOn(fsPromises, 'writeFile').mockResolvedValue();
    const expectedUri = path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'files',
      `${mockFile.id}.${mockFile.extension}`
    );

    // Act
    const result = await handleFileSystem({ file: mockFile, filePaths: mockFilePaths });

    // Assert
    expect(writeFileSpy).toHaveBeenCalledWith(expectedUri, '');
    expect(result.provider).toBe('sys');
    expect(result.uri).toBe(expectedUri);
  });

  it('should handle a folder file correctly', async () => {
    // Arrange
    const writeFileSpy = jest.spyOn(fsPromises, 'writeFile').mockResolvedValue();
    const mkdirSpy = jest.spyOn(fsPromises, 'mkdir').mockResolvedValue();
    const expectedUri = path.resolve(__dirname, '..', '..', '..', 'files', `${mockFile.id}`);
    mockFile.isFolder = true;

    // Act
    const result = await handleFileSystem({ file: mockFile, filePaths: mockFilePaths });

    // Assert
    expect(mkdirSpy).toHaveBeenCalledTimes(mockFilePaths.length);
    expect(writeFileSpy).toHaveBeenCalledTimes(mockFilePaths.length);
    expect(result.provider).toBe('sys');
    expect(result.uri).toBe(expectedUri);
  });
});
