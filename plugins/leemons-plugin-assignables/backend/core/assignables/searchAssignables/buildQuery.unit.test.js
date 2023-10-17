const { it, beforeEach, expect } = require('@jest/globals');

const { generateCtx } = require('@leemons/testing');

const { buildQuery } = require('./buildQuery');
const { searchBySubject } = require('../../subjects/searchBySubject');
const { searchByProgram } = require('../../subjects/searchByProgram');
const { listRoles } = require('../../roles/listRoles');

jest.mock('../../subjects/searchBySubject');
jest.mock('../../subjects/searchByProgram');
jest.mock('../../roles/listRoles');

const searchHandler = jest.fn();

describe('buildQuery', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('Should build a query', async () => {
    // Arrange
    const params = {
      query: {},
      search: 'search string',
      sort: 'name:asc',
      ctx: generateCtx({
        actions: {
          'leebrary.search.search': searchHandler,
        },
      }),
    };
    listRoles.mockResolvedValue(['role1', 'role2']);
    searchHandler.mockResolvedValue([
      [
        { asset: 'asset1-1', role: 'role1' },
        { asset: 'asset1-2', role: 'role1' },
      ],
      [{ asset: 'asset2', role: 'role2' }],
    ]);

    // Act
    const result = await buildQuery(params);
    const result2 = await buildQuery({
      ...params,
      sort: 'name',
      roles: 'role1',
    });

    // Assert

    expect(listRoles).toBeCalledWith({ ctx: params.ctx });
    expect(searchHandler).toBeCalledWith({
      criteria: params.search,
      category: expect.anything(),
      allVersions: true,
      published: 'all',
      sortBy: ['name'],
      sortDirection: 'asc',
      ctx: params.ctx,
    });

    expect(result.query.role).toEqual(params.roles);
    expect(result.query.asset).toEqual(['asset1-1', 'asset1-2', 'asset2']);
    expect(result.sorting).toEqual([{ key: 'name', direction: 'asc' }]);
    expect(result.assets).toEqual(['asset1-1', 'asset1-2', 'asset2']);

    expect(result2.query.role).toEqual(['role1']);
    expect(result2.query.asset).toEqual(['asset1-1', 'asset1-2', 'asset2']);
    expect(result2.sorting).toEqual([{ key: 'name', direction: 'asc' }]);
    expect(result2.assets).toEqual(['asset1-1', 'asset1-2', 'asset2']);
  });

  it('Should build a query with no by name sort', async () => {
    // Arrange
    const params = {
      query: {},
      roles: ['role1', 'role2'],
      search: 'search string',
      sort: 'date:desc',
      ctx: generateCtx({
        actions: {
          'leebrary.search.search': searchHandler,
        },
      }),
    };
    listRoles.mockResolvedValue(['role1', 'role2']);
    searchHandler.mockResolvedValue([
      [
        { asset: 'asset1-1', role: 'role1' },
        { asset: 'asset1-2', role: 'role1' },
      ],
      [{ asset: 'asset2', role: 'role2' }],
    ]);

    // Act
    const result = await buildQuery(params);

    // Assert
    expect(listRoles).not.toBeCalled();
    expect(searchHandler).toBeCalledWith({
      criteria: params.search,
      category: expect.anything(),
      allVersions: true,
      published: 'all',
      showPublic: true,
      ctx: params.ctx,
    });

    expect(result.query.role).toEqual(params.roles);
    expect(result.query.asset).toEqual(['asset1-1', 'asset1-2', 'asset2']);
    expect(result.sorting).toEqual([{ direction: 'desc', key: 'date' }]);
    expect(result.assets).toEqual(['asset1-1', 'asset1-2', 'asset2']);
  });

  it('Should build a query with subjects', async () => {
    // Arrange
    const params = {
      query: {},
      subjects: ['subject1', 'subject2'],
      ctx: {},
    };
    searchBySubject.mockResolvedValue(['assignable1', 'assignable2']);

    // Act
    const result = await buildQuery(params);

    // Assert
    expect(result.query.id).toEqual(['assignable1', 'assignable2']);
  });

  it('Should build a query with program', async () => {
    // Arrange
    const params = {
      query: {},
      program: 'program1',
      ctx: {},
    };
    searchByProgram.mockResolvedValue(['assignable1', 'assignable2']);

    // Act
    const result = await buildQuery(params);

    // Assert
    expect(result.query.id).toEqual(['assignable1', 'assignable2']);
  });

  it('Should build a query with subjects and program', async () => {
    // Arrange
    const params = {
      query: {},
      subjects: ['subject1', 'subject2'],
      program: 'program1',
      ctx: {},
    };
    searchBySubject.mockResolvedValue(['assignable1', 'assignable2']);
    searchByProgram.mockResolvedValue(['assignable1', 'assignable3']);
    listRoles.mockResolvedValue(['role1', 'role2']);

    // Act
    const result = await buildQuery(params);

    // Assert
    expect(listRoles).toBeCalledWith({ ctx: params.ctx });
    expect(searchBySubject).toBeCalledWith({
      id: expect.anything(),
      ctx: params.ctx,
    });
    expect(searchByProgram).toBeCalledWith({
      id: expect.anything(),
      ctx: params.ctx,
    });
    expect(result.query.id).toEqual(['assignable1']);
  });

  it('Should return null where no assets are found and there are search param', async () => {
    // Arrange
    const params = {
      query: {},
      roles: ['role1', 'role2'],
      search: 'search string2',
      ctx: generateCtx({
        actions: {
          'leebrary.search.search': searchHandler,
        },
      }),
    };
    searchHandler.mockResolvedValue([]);

    // Act
    const result = await buildQuery(params);

    // Assert
    expect(result).toBeNull();
  });
});
