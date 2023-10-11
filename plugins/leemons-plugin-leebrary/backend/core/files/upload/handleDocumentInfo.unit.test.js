const { expect, it, beforeEach } = require('@jest/globals');
const document = require('office-document-properties');

const { handleDocumentInfo } = require('./handleDocumentInfo');
const { getMetaProps } = require('./getMetaProps');

jest.mock('office-document-properties');
jest.mock('./getMetaProps');

beforeEach(() => jest.resetAllMocks());

it('should return metadata for docx file', async () => {
  // Arrange
  const metadata = { title: 'Test' };
  const path = 'test.docx';
  const extension = 'docx';
  const props = { title: 'Test' };
  document.fromFilePath.mockImplementation((_, handler) => handler(null, props));
  getMetaProps.mockReturnValue(metadata);

  // Act
  const result = await handleDocumentInfo({ metadata, path, extension });

  // Assert
  expect(getMetaProps).toBeCalledWith({ data: props, result: metadata });
  expect(result).toEqual(metadata);
});

it('should return the metadata unmodified for non-office-documents', async () => {
  // Arrange
  const metadata = { title: 'Test' };
  const path = 'test.txt';
  const extension = 'txt';

  // Act
  const result = await handleDocumentInfo({ metadata, path, extension });

  // Assert
  expect(getMetaProps).not.toBeCalled();
  expect(result).toEqual(metadata);
});

it('should throw error when document.fromFilePath fails', async () => {
  // Arrange
  const metadata = { title: 'Test' };
  const path = 'test.docx';
  const extension = 'docx';
  const error = new Error('Error');
  document.fromFilePath.mockImplementation((_, handler) => handler(error));

  // Act and Assert
  await expect(handleDocumentInfo({ metadata, path, extension })).rejects.toThrow(error);
});
