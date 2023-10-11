const {
  expect,
  it,
  beforeEach,
  jest: { fn },
} = require('@jest/globals');
const got = require('got');

const { getRemoteContentType } = require('./getRemoteContentType');

jest.mock('got');

beforeEach(() => {
  jest.resetAllMocks();
});

const url = 'http://example.com';

it('Should resolve with content type when got resolves', async () => {
  // Arrange
  const contentType = 'text/html';
  got.mockImplementationOnce(() => ({
    on: (event, handler) => {
      if (event === 'response') {
        handler({ headers: { 'content-type': contentType }, destroy: jest.fn() });
      }
      return { on: fn() };
    },
  }));

  // Act
  const result = await getRemoteContentType(url);

  // Assert
  expect(got).toBeCalledWith(url, { isStream: true });
  expect(result).toBe(contentType);
});

it('Should reject with error when got rejects', async () => {
  // Arrange
  const error = new Error('Network error');
  got.mockImplementationOnce(() => {
    const mockOn = jest.fn((event, handler) => {
      if (event === 'error') {
        handler(error);
      }
      return { on: mockOn };
    });
    return { on: mockOn };
  });

  // Act and Assert
  await expect(getRemoteContentType(url)).rejects.toEqual(error);
});

it('Should reject with error when exception is thrown', async () => {
  // Arrange
  const error = new Error('Exception error');
  got.mockImplementationOnce(() => {
    throw error;
  });

  // Act and Assert
  await expect(getRemoteContentType(url)).rejects.toThrow(error);
});
