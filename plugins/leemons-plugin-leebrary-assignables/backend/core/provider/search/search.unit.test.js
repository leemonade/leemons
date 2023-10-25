const { it, expect, describe } = require('@jest/globals');
const { search } = require('./search');

describe('Search Assignables', () => {
  it('should return an array of asset IDs when valid parameters are provided', async () => {
    // Arrange
    const params = {
      criteria: {},
      query: {},
      category: { key: 'assignables.key' },
      assets: ['asset1', 'asset2'],
      published: true,
      preferCurrent: true,
      ctx: {
        tx: {
          call: jest
            .fn()
            .mockResolvedValueOnce(['asset1', 'asset2'])
            .mockResolvedValueOnce({ asset1: 'asset1', asset2: 'asset2' }),
        },
      },
    };

    // Act
    const result = await search(params);

    // Assert
    expect(result).toEqual(['asset1', 'asset2']);
    expect(params.ctx.tx.call).toHaveBeenCalledWith('assignables.assignables.searchAssignables', {
      role: 'key',
      published: true,
      preferCurrent: true,
      search: {},
      subjects: undefined,
      program: undefined,
    });
    expect(params.ctx.tx.call).toHaveBeenCalledWith(
      'assignables.assignables.getAssignablesAssets',
      {
        assignablesIds: ['asset1', 'asset2'],
      }
    );
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
      ctx: {
        tx: {
          call: jest.fn().mockResolvedValueOnce([]).mockResolvedValueOnce({}),
        },
      },
    };

    // Act
    const result = await search(params);

    // Assert
    expect(result).toEqual([]);
    expect(params.ctx.tx.call).toHaveBeenCalledWith('assignables.assignables.searchAssignables', {
      role: 'key',
      published: true,
      preferCurrent: true,
      search: {},
      subjects: undefined,
      program: undefined,
    });
    expect(params.ctx.tx.call).toHaveBeenCalledWith(
      'assignables.assignables.getAssignablesAssets',
      {
        assignablesIds: [],
      }
    );
  });
});
