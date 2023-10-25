const {
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  jest: globalJest,
} = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

globalJest.mock('../../leebrary/assets');
globalJest.mock('../getAssignables');

const { pick } = require('lodash');
const { removeAssignables } = require('./removeAssignables');
const { assignablesSchema } = require('../../../models/assignables');

const { getAsset } = require('../../leebrary/assets');
const { getAssignables } = require('../getAssignables');
const {
  getAssignableObject,
} = require('../../../__fixtures__/getAssignableObject');

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

it('Removes all the requested assignables', async () => {
  // Arrange
  const ids = ['assignable-id-1', 'assignable-id-2'];
  const assets = ['asset-id-1', 'asset-id-2'];
  const assignable = getAssignableObject();

  const ctx = generateCtx({
    models: {
      Assignables: newModel(
        mongooseConnection,
        'Assignables',
        assignablesSchema
      ),
    },
  });

  const initialValues = [
    {
      id: ids[0],
      ...pick(assignable, [
        'role',
        'gradable',
        'center',
        'statement',
        'development',
        'duration',
        'submission',
        'resources',
        'metadata',
      ]),
      asset: assets[0],
    },
    {
      id: ids[1],
      ...pick(assignable, [
        'role',
        'gradable',
        'center',
        'statement',
        'development',
        'duration',
        'submission',
        'resources',
        'metadata',
      ]),
      asset: assets[1],
    },
  ];
  await ctx.db.Assignables.create(initialValues);

  getAssignables.mockImplementation(() =>
    ids.map((id) => ({
      ...assignable,
      id,
    }))
  );

  getAsset.mockImplementation(({ id: el }) =>
    el.map((id) => ({ id, indexable: true }))
  );

  // Act
  const response = await removeAssignables({ ids, ctx });
  const dbDataAfterDeletion = await ctx.db.Assignables.find({}, '', {
    excludeDeleted: false,
  }).lean();

  // Assert
  expect(response).toEqual(2);
  expect(dbDataAfterDeletion).toHaveLength(2);
  expect(
    dbDataAfterDeletion.every(({ isDeleted }) => !!isDeleted)
  ).toBeTruthy();
});
