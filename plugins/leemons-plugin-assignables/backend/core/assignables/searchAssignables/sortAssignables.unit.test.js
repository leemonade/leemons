const { it, expect, beforeEach } = require('@jest/globals');
const { sortAssignables } = require('./sortAssignables');

describe('sortAssignables', () => {
  let sorting;
  let assignablesIds;
  let assets;

  beforeEach(() => {
    sorting = [{ key: 'name' }];
    assignablesIds = [
      { id: '1', asset: 'asset1' },
      { id: '2', asset: 'asset2' },
      { id: '3', asset: 'asset3' },
      { id: '4', asset: 'asset4' },
    ];
    assets = ['asset3', 'asset1', 'asset2'];
  });

  it('Should sort assignables based on the order of assets', () => {
    const sortedAssignables = sortAssignables(sorting, assignablesIds, assets);

    expect(sortedAssignables).toEqual(['4', '3', '1', '2']);
  });

  it('Should return the same order if no sorting is provided', () => {
    const sortedAssignables = sortAssignables(undefined, assignablesIds, assets);

    expect(sortedAssignables).toEqual(['1', '2', '3', '4']);
  });

  it('Should return the same order if no sorting is provided', () => {
    const sortedAssignables = sortAssignables({ key: 'date' }, assignablesIds, assets);

    expect(sortedAssignables).toEqual(['1', '2', '3', '4']);
  });
});
