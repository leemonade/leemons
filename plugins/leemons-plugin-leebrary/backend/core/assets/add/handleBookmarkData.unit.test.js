const {
  it,
  expect,
  beforeEach,
  jest: { spyOn },
} = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

jest.mock('../../shared');
jest.mock('got');
const got = require('got');
const { metascraper } = require('../../shared');

const { handleBookmarkData } = require('./handleBookmarkData');
const getAssetAddDataInput = require('../../../__fixtures__/getAssetAddDataInput');

beforeEach(() => jest.resetAllMocks());

it('Should process bookmark data and cover correctly, only when data.url is passed and data.icon is missing', async () => {
  // Arrange
  const { dataInput, dataInputWithEmptyFields, cover } = getAssetAddDataInput();
  const inputWithoutUrl = {
    data: { ...dataInput, url: undefined },
    cover: null,
  };

  const ctx = generateCtx({});
  const spyLogger = spyOn(ctx.logger, 'error');

  const mockedMeta = {
    title: 'Mock meta Title',
    description: 'Mock meta Description',
    logo: 'Mock meta Logo URL',
    image: 'Mock meta Image',
  };
  const mockHtml = '<html></html>';
  got.mockResolvedValue({ body: mockHtml });
  metascraper.mockResolvedValue(mockedMeta);

  const expectedResult = { data: { ...dataInput }, cover };
  const expectedResultEmptyFields = {
    data: {
      ...dataInputWithEmptyFields,
      name: mockedMeta.title,
      description: mockedMeta.description,
      icon: mockedMeta.logo,
      cover: mockedMeta.image,
    },
    cover: mockedMeta.image,
  };
  const expectedResultNoUrl = [inputWithoutUrl.data, inputWithoutUrl.cover];

  // Act
  const [dataOutput, coverOutput] = await handleBookmarkData({
    data: { ...dataInput },
    cover,
    ctx,
  });
  const [dataOutputWithEmptyFields, coverOutputWithEmptyFields] = await handleBookmarkData({
    data: { ...dataInputWithEmptyFields },
    cover: null,
    ctx,
  });
  const testFnWithoutUrl = await handleBookmarkData({ ...inputWithoutUrl, ctx });

  // Assert
  expect(dataOutput).toEqual(expectedResult.data);
  expect(coverOutput).toEqual(expectedResult.cover);
  expect(dataOutputWithEmptyFields).toEqual(expectedResultEmptyFields.data);
  expect(coverOutputWithEmptyFields).toEqual(expectedResultEmptyFields.cover);
  expect(testFnWithoutUrl).toEqual(expectedResultNoUrl);
  expect(spyLogger).not.toHaveBeenCalled();
});

it('Logs an error message when an error is catched and handles unexpected values without throwing', async () => {
  // Arrange
  const { dataInputWithEmptyFields, cover } = getAssetAddDataInput();

  const ctx = generateCtx({});
  const spyLogger = spyOn(ctx.logger, 'error');

  got.mockImplementation(() => {
    throw new Error('Got Error');
  });

  // Act
  await handleBookmarkData({ data: { ...dataInputWithEmptyFields }, cover, ctx });

  // Assert
  expect(spyLogger).toHaveBeenCalledWith(
    'Error getting bookmark metadata:',
    dataInputWithEmptyFields.url,
    expect.any(Error)
  );
});

it('Should correctly process data', async () => {
  // Arrange
  const data = { cover: ' dataCover', url: 'url', name: 'name' };
  const ctx = generateCtx({});

  const mockedMeta = {
    title: 'Mock meta Title',
    description: 'Mock meta Description',
    logo: '',
    image: 'Mock meta Image',
  };
  const mockHtml = '<html></html>';
  got.mockResolvedValue({ body: mockHtml });
  metascraper.mockResolvedValue(mockedMeta);

  const expectedResult = [
    {
      ...data,
      cover: mockedMeta.image,
      name: data.name,
      description: mockedMeta.description,
    },
    mockedMeta.image,
  ];

  // Act
  const [dataOutput, coverOutput] = await handleBookmarkData({
    data,
    ctx,
  });

  // Assert
  expect(dataOutput).toEqual(expectedResult[0]);
  expect(coverOutput).toEqual(expectedResult[1]);
});
