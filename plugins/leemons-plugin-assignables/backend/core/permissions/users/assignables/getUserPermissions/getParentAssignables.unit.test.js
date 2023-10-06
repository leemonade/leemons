const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');

const { generateCtx, createMongooseConnection } = require('leemons-testing');
const { newModel } = require('leemons-mongodb');

const { getParentAssignables } = require('./getParentAssignables');
const { assignablesSchema } = require('../../../../../models/assignables');
const { getAssignableObject } = require('../../../../../__fixtures__/getAssignableObject');

const assignableId = 'b82cf6dd-5ef0-41fa-a4c1-930d34a46eba@2.0.0';
const assignable = {
  ...getAssignableObject(),
  asset: 'assetId1',
  id: assignableId,
  submission: {
    activities: [
      {
        activity: 'b82cf6dd-5ef0-41fa-a4c1-930d34a46eba@2.0.0',
        id: '646ded7b-3bd5-499d-82b7-bbdd2965f06c',
      },
      {
        activity: '19446d61-ec54-4222-a383-1a9a52e04d9f@2.0.0',
        id: '5d0c3d4a-853a-46e1-9833-3617d408ffe0',
      },
    ],
  },
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
      Assignables: newModel(mongooseConnection, 'Assignables', assignablesSchema),
    },
  });

  await ctx.tx.db.Assignables.create(assignable);
});

it('Should return the parent assignables', async () => {
  // Arrange
  const ids = [assignableId];

  // Act
  const response = await getParentAssignables({ ids, ctx });

  // Assert
  expect(response).toEqual({
    assetId1: [
      {
        asset: 'assetId1',
        activity: 'b82cf6dd-5ef0-41fa-a4c1-930d34a46eba@2.0.0',
      },
      {
        asset: 'assetId1',
        activity: '19446d61-ec54-4222-a383-1a9a52e04d9f@2.0.0',
      },
    ],
  });
});

it('Should return empty object if not parent Assignables found', async () => {
  // Arrange
  const ids = ['non-existentId'];

  // Act
  const response = await getParentAssignables({ ids, ctx });

  // Assert
  expect(response).toEqual({});
});
