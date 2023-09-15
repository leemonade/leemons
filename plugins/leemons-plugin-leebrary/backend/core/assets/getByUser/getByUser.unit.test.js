const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const _ = require('lodash');

const { getByUser } = require('./getByUser');
const { assetsSchema } = require('../../../models/assets');

let mongooseConnection;
let disconnectMongoose;

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
});

it('Should correctly query the db and return the assets of the user', async () => {
  // Arrange
  const userId = 'user1';

  const ctx = generateCtx({
    models: {
      Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
    },
  });

  const initialValues = [
    { fromUser: 'user1', id: 'asset1' },
    { fromUser: 'user2', id: 'asset2' },
    { fromUser: 'user1', id: 'asset3' },
  ];
  await ctx.db.Assets.create(initialValues);
  const expectedResponse = [
    { fromUser: initialValues[0].fromUser, id: initialValues[0].id },
    { fromUser: initialValues[2].fromUser, id: initialValues[2].id },
  ];

  // Act
  let response = await getByUser({ userId, ctx });
  response = response.sort((a, b) => a.id.localeCompare(b.id));

  // Assert
  response.forEach((obj, i) => {
    expect(obj.fromUser).toEqual(expectedResponse[i].fromUser);
    expect(obj.id).toEqual(expectedResponse[i].id);
    expect(_.isPlainObject(obj)).toBe(true);
  });
});

it('Should return an empty array if no assets are found for the user', async () => {
  // Arrange
  const userId = 'user3';

  const ctx = generateCtx({
    models: {
      Assets: newModel(mongooseConnection, 'Assets', assetsSchema),
    },
  });

  const initialValues = [
    { fromUser: 'user1', id: 'asset1' },
    { fromUser: 'user2', id: 'asset2' },
    { fromUser: 'user1', id: 'asset3' },
  ];
  await ctx.db.Assets.create(initialValues);

  // Act
  const response = await getByUser({ userId, ctx });

  // Assert
  expect(response).toEqual([]);
});
