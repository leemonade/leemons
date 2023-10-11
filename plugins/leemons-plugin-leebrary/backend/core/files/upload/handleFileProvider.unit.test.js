const {
  it,
  expect,
  beforeEach,
  jest: { fn },
} = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');
const pathSys = require('path');
const fsPromises = require('fs/promises');

const { handleFileProvider } = require('./handleFileProvider');
const { getByName } = require('../../providers/getByName');
const getProviders = require('../../../__fixtures__/getProviders');

// MOCKS
jest.mock('path');
jest.mock('fs/promises');
jest.mock('../../providers/getByName');

beforeEach(() => jest.resetAllMocks());

const {
  provider: {
    value: { params: mockProvider },
  },
} = getProviders();

it('Should call handleFileProvider correctly', async () => {
  // Arrange
  const newFile = { name: 'file' };
  const settings = { providerName: mockProvider.pluginName };
  const path = 'path/to/file.txt';
  const uploadAction = fn(() => Promise.resolve('uri'));
  const mockBuffer = Buffer.from('This is a mock buffer');

  const ctx = generateCtx({
    actions: {
      [`${mockProvider.pluginName}.files.upload`]: uploadAction,
    },
  });

  getByName.mockResolvedValue({ ...mockProvider });
  fsPromises.readFile.mockResolvedValue(mockBuffer);

  const expectedResponse = { provider: settings.providerName, uri: 'uri' };
  // Act
  const response = await handleFileProvider({ newFile, settings, path, ctx });

  // Assert
  expect(getByName).toBeCalledWith({ name: settings.providerName, ctx });
  expect(fsPromises.readFile).toBeCalledWith(path);
  expect(uploadAction).toBeCalledWith({ item: newFile, buffer: mockBuffer });
  expect(response).toEqual(expectedResponse);
});

it('Should correctly set urlData for default provider', async () => {
  // Arrange
  const newFile = { name: 'file' };
  const path = 'path/to/file.txt';
  const uploadAction = fn();
  const mockBuffer = Buffer.from('This is a mock buffer');

  const ctx = generateCtx({
    actions: {
      [`${mockProvider.pluginName}.files.upload`]: uploadAction,
    },
  });

  getByName.mockResolvedValue({});
  pathSys.resolve.mockReturnValue('uri');
  fsPromises.readFile.mockResolvedValue(mockBuffer);

  const expectedResponse = { provider: 'sys', uri: 'uri' };

  // Act
  const response = await handleFileProvider({ newFile, path, ctx });
  const responseForNotSupportedMethods = await handleFileProvider({
    newFile,
    settings: { providerName: mockProvider.name },
    path,
    ctx,
  });

  // Assert
  expect(fsPromises.writeFile).toBeCalledWith('uri', mockBuffer);
  expect(response).toEqual(expectedResponse);
  expect(getByName).toBeCalledTimes(1);
  expect(uploadAction).not.toBeCalled();
  expect(responseForNotSupportedMethods).toEqual(expectedResponse);
});
