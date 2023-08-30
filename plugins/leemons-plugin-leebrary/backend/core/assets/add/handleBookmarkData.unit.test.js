const {
  it,
  expect,
  jest: { spyOn },
} = require('@jest/globals');
const { generateCtx } = require('leemons-testing');

jest.mock('../../shared/metascraper');
jest.mock('got');

const { handleBookmarkData } = require('./handleBookmarkData');
const got = require('got');
const metascraper = require('../../shared/metascraper');
const getBookmarkData = require('../../../__fixtures__/getBookmarkData');

it('Should process bookmark data and cover correctly, only when data.url is passed and data.icon is missing', async () => {
  // Arrange
  const { dataInput, dataInputWithEmptyFields, cover } = getBookmarkData();
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
  const { dataInputWithEmptyFields, cover } = getBookmarkData();

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

  //* Este test es inecesario realmente, es una función privada a la que SIEMPRE se le pasa data
  //* Validar data es responsabilidad de la main function, que la invoca a esta helper.
  //* ====> expect(responseWithoutData).toEqual([undefined, cover]);
});

// TODO Paola: So, where are fields like data.name validated? What if data.name = ['surprise']
