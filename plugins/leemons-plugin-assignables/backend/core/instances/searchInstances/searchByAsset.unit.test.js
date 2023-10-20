const { it, expect, beforeEach } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { searchByAsset } = require('./searchByAsset');

const searchHandler = jest.fn();

beforeEach(() => {
  jest.resetAllMocks();
});

it('should return assets correctly', async () => {
  // Arrange
  const ctx = generateCtx({
    actions: {
      'leebrary.search.search': searchHandler,
    },
  });

  const query = {
    search: 'search',
  };

  const mockedParams = {
    assignablesByAssignableInstance: [
      {
        asset: 'asset1',
        role: 'teacher',
      },
      {
        asset: 'asset2',
        role: 'student',
      },
    ],
    query,
    ctx,
  };

  searchHandler
    .mockResolvedValue([
      {
        asset: 'asset1',
      },
    ])
    .mockResolvedValueOnce([
      {
        asset: 'asset2',
      },
    ]);

  const expectedValue = ['asset1', 'asset2'];

  // Act
  const response = await searchByAsset(mockedParams);

  // Assert
  expect(searchHandler).toBeCalledWith({
    criteria: query.search,
    category: expect.stringContaining('assignables.'),
    allVersions: true,
    published: true,
  });
  expect(response).toEqual(expect.arrayContaining(expectedValue));
});

it('should return empty array if no assets found', async () => {
  // Arrange
  const ctx = generateCtx({});
  const query = {
    search: undefined,
  };

  const mockedParams = {
    assignablesByAssignableInstance: [
      {
        asset: 'asset1',
        role: 'teacher',
      },
      {
        asset: 'asset2',
        role: 'student',
      },
    ],
    query,
    ctx,
  };
  const expectedValue = null;
  // Act
  const response = await searchByAsset(mockedParams);

  // Assert
  expect(searchHandler).not.toBeCalled();
  expect(response).toEqual(expectedValue);
});
