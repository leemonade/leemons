const {
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} = require('@jest/globals');

const { newModel } = require('@leemons/mongodb');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');

const { getAssignablesAssets } = require('./getAssignablesAssets');
const { assignablesSchema } = require('../../../models/assignables');
const {
  getAssignableObject,
} = require('../../../__fixtures__/getAssignableObject');

describe('getAssignablesAssets', () => {
  let mongooseConnection;
  let disconnectMongoose;
  let ctx;
  let assignables;
  let expectedAssignables;
  const assignable = getAssignableObject();

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
    assignables = [
      { ...assignable, id: 'assignable1', asset: 'asset1' },
      { ...assignable, id: 'assignable2', asset: 'asset2' },
    ];
    expectedAssignables = {
      assignable1: 'asset1',
      assignable2: 'asset2',
    };

    await ctx.tx.db.Assignables.create(assignables);
  });
  // Arrange

  it('should return assignables for given asset ids', async () => {
    // Act
    const result = await getAssignablesAssets({
      ids: assignables.map((el) => el.id),
      ctx,
    });

    // Assert
    expect(result).toEqual(expectedAssignables);
  });
});
