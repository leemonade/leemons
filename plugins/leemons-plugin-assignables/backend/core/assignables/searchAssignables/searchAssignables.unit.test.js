const { it, expect, beforeEach } = require('@jest/globals');

const { LeemonsError } = require('@leemons/error');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { assignablesSchema } = require('../../../models/assignables');
const { searchAssignables } = require('./searchAssignables');
const {
  getAssignableObject,
} = require('../../../__fixtures__/getAssignableObject');

jest.mock('./buildQuery');
jest.mock('./filterByPublished');
jest.mock('./filterByPreferCurrent');
jest.mock('../../permissions/assignables/users/getUserPermissions');

const { buildQuery } = require('./buildQuery');
const { filterByPublished } = require('./filterByPublished');
const { filterByPreferCurrent } = require('./filterByPreferCurrent');
const {
  getUserPermissions,
} = require('../../permissions/assignables/users/getUserPermissions');

describe('searchAssignables', () => {
  let mongooseConnection;
  let disconnectMongoose;
  let assignable;
  let assignables;
  let ctx;
  beforeAll(async () => {
    const { mongoose, disconnect } = await createMongooseConnection();

    mongooseConnection = mongoose;
    disconnectMongoose = disconnect;
  });

  afterAll(async () => {
    await disconnectMongoose();

    mongooseConnection = null;
    disconnectMongoose = null;
  });

  beforeEach(async () => {
    await mongooseConnection.dropDatabase();

    ctx = generateCtx({
      models: {
        Assignables: newModel(
          mongooseConnection,
          'Assignables',
          assignablesSchema
        ),
      },
    });
    assignable = getAssignableObject();
    assignables = [
      { ...assignable, id: 'assignable1', asset: 'asset1', role: 'student' },
      { ...assignable, id: 'assignable2', asset: 'asset2', role: 'student' },
      { ...assignable, id: 'assignable3', asset: 'asset3', role: 'student' },
      { ...assignable, id: 'assignable4', asset: 'asset4', role: 'editor' },
    ];

    await ctx.tx.db.Assignables.create(assignables);
  });

  it('Should return the ids of the assignables that match the search', async () => {
    // Arrange
    const params = {
      roles: ['student'],
      data: {
        published: true,
        preferCurrent: true,
        sort: 'name:asc',
      },
      ctx,
    };

    buildQuery.mockReturnValue({
      query: { role: ['student'] },
      sorting: [{ key: 'name', direction: 'asc' }],
      assets: ['asset2', 'asset1', 'asset3', 'asset4'],
    });

    getUserPermissions.mockReturnValue({
      assignable1: { actions: ['view'] },
      assignable2: { actions: ['view'] },
      assignable3: { actions: [] },
    });

    filterByPublished.mockReturnValue({
      uuid2: [
        {
          id: 'assignable2',
          uuid: 'uuid2',
          version: '1.0.0',
          fullId: 'uuid2@1.0.0',
        },
        {
          id: 'assignable2',
          uuid: 'uuid2',
          version: '2.0.0',
          fullId: 'uuid2@2.0.0',
        },
      ],
      uuid1: [
        {
          id: 'assignable1',
          uuid: 'uuid1',
          version: '1.0.0',
          fullId: 'uuid2@1.0.0',
        },
      ],
    });

    filterByPreferCurrent.mockReturnValue({
      uuid2: [
        {
          id: 'assignable2',
          uuid: 'uuid2',
          version: '1.0.0',
          fullId: 'uuid2@1.0.0',
        },
        {
          id: 'assignable2',
          uuid: 'uuid2',
          version: '2.0.0',
          fullId: 'uuid2@2.0.0',
        },
      ],
      uuid1: [
        {
          id: 'assignable1',
          uuid: 'uuid1',
          version: '1.0.0',
          fullId: 'uuid1@1.0.0',
        },
      ],
    });

    // Act
    const result = await searchAssignables(params);

    // Assert
    expect(buildQuery).toBeCalledWith({
      query: {},
      roles: params.roles,
      search: params.data.search,
      sort: params.data.sort,
      subjects: params.data.subjects,
      program: params.data.program,
      ctx: params.ctx,
    });

    expect(getUserPermissions).toBeCalledWith({
      assignables: expect.arrayContaining([
        {
          _id: expect.anything(),
          id: 'assignable3',
          asset: 'asset3',
        },
        {
          _id: expect.anything(),
          id: 'assignable1',
          asset: 'asset1',
        },
        {
          _id: expect.anything(),
          id: 'assignable2',
          asset: 'asset2',
        },
      ]),
      ctx: params.ctx,
    });

    expect(filterByPublished).toBeCalledWith({
      assignablesIds: ['assignable2', 'assignable1'],
      published: params.data.published,
      ctx: params.ctx,
    });

    expect(filterByPreferCurrent).toBeCalledWith({
      assignablesIds: {
        uuid2: [
          {
            id: 'assignable2',
            uuid: 'uuid2',
            version: '1.0.0',
            fullId: 'uuid2@1.0.0',
          },
          {
            id: 'assignable2',
            uuid: 'uuid2',
            version: '2.0.0',
            fullId: 'uuid2@2.0.0',
          },
        ],
        uuid1: [
          {
            id: 'assignable1',
            uuid: 'uuid1',
            version: '1.0.0',
            fullId: 'uuid2@1.0.0',
          },
        ],
      },
      published: params.data.published,
      preferCurrent: params.data.preferCurrent,
      ctx: params.ctx,
    });

    expect(result).toEqual(['uuid2@2.0.0', 'uuid1@1.0.0']);
  });

  it('Should return an empty array when BuildQuery is null', async () => {
    // Arrange
    const params = {
      roles: ['student'],
      data: {
        published: true,
        preferCurrent: true,
        sort: 'name:asc',
      },
      ctx,
    };

    buildQuery.mockReturnValue(null);

    // Act
    const response = await searchAssignables(params);

    // Assert
    expect(response).toEqual([]);
  });

  it('Should throw Error when function fails', async () => {
    // Arrange
    const params = {
      roles: ['student'],
      data: {
        published: true,
        preferCurrent: true,
        sort: 'name:asc',
      },
      ctx,
    };

    const message = 'Error Message';
    buildQuery.mockImplementation(() => {
      throw new Error(message);
    });

    // Act
    const testFunc = () => searchAssignables(params);

    // Assert
    await expect(testFunc).rejects.toThrowError(
      new LeemonsError(ctx, {
        message: `Error searching assignables: ${message}`,
      })
    );
  });
});
