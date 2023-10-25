const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { getAssignables } = require('./getAssignables');
const { instancesSchema } = require('../../../models/instances');
const { assignablesSchema } = require('../../../models/assignables');
const { getInstanceObject } = require('../../../__fixtures__/getInstanceObject');
const { getAssignableObject } = require('../../../__fixtures__/getAssignableObject');

const instance = { ...getInstanceObject(), id: 'assignableId1' };
const assignable = {
  ...getAssignableObject(),
  asset: 'assetId',
  id: instance.assignable,
};

let mongooseConnection;
let disconnectMongoose;
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
      Instances: newModel(mongooseConnection, 'Instances', instancesSchema),
      Assignables: newModel(mongooseConnection, 'Assignables', assignablesSchema),
    },
  });
});

it('Should return assignables if instances match', async () => {
  // Arrange
  await ctx.tx.db.Instances.create(instance);
  await ctx.tx.db.Assignables.create(assignable);

  // Act
  const response = await getAssignables({
    assignableInstancesIds: [instance.id],
    ctx,
  });

  // Assert
  expect(response).toEqual([
    expect.objectContaining({
      asset: 'assetId',
      assignable: 'test-assignable',
      id: 'assignableId1',
      role: 'example',
    }),
  ]);
});

it('Should return empty array if no instances match', async () => {
  // Arrange

  // Act
  const response = await getAssignables({
    assignableInstancesIds: ['nonexistent-id'],
    ctx,
  });

  // Assert
  expect(response).toEqual([]);
});
