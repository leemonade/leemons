const { it, expect, describe, beforeEach } = require('@jest/globals');

const { generateCtx } = require('@leemons/testing');

const { search } = require('./search');

jest.mock('../../assignables/searchAssignables');
jest.mock('../../assignables/getAssignablesAssets');

const { searchAssignables } = require('../../assignables/searchAssignables');
const { getAssignablesAssets } = require('../../assignables/getAssignablesAssets');

describe('Search Assignables', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return an array of asset IDs when valid parameters are provided', async () => {
    // Arrange
    const params = {
      criteria: {},
      query: {},
      category: { key: 'assignables.key' },
      assets: ['asset1', 'asset2'],
      published: true,
      preferCurrent: true,
      ctx: generateCtx({}),
    };
    searchAssignables.mockResolvedValue(['asset1', 'asset2']);
    getAssignablesAssets.mockResolvedValue({ asset1: 'asset1', asset2: 'asset2' });

    // Act
    const result = await search(params);

    // Assert
    expect(result).toEqual(['asset1', 'asset2']);
    expect(searchAssignables).toHaveBeenCalledWith({
      roles: 'key',
      data: {
        published: true,
        preferCurrent: true,
        search: {},
        subjects: undefined,
        program: undefined,
      },
      ctx: params.ctx,
    });
    expect(getAssignablesAssets).toHaveBeenCalledWith({
      ids: params.assets,
      ctx: params.ctx,
    });
  });

  it('should return an empty array when no assets match the search criteria', async () => {
    // Arrange
    const params = {
      criteria: {},
      query: {},
      category: { key: 'assignables.key' },
      assets: ['asset3', 'asset4'],
      published: true,
      preferCurrent: true,
      ctx: generateCtx({}),
    };
    searchAssignables.mockResolvedValue([]);
    getAssignablesAssets.mockResolvedValue({});

    // Act
    const result = await search(params);

    // Assert
    expect(result).toEqual([]);
    expect(searchAssignables).toHaveBeenCalledWith({
      roles: 'key',
      data: {
        published: true,
        preferCurrent: true,
        search: {},
        subjects: undefined,
        program: undefined,
      },
      ctx: params.ctx,
    });
    expect(getAssignablesAssets).toHaveBeenCalledWith({
      ids: [],
      ctx: params.ctx,
    });
  });
});
