const { it, expect } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { findAssignationDates } = require('./findAssignationDates');
const { getServiceModels } = require('../../../models');

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

it('Should find assignation dates', async () => {
  // Arrange
  const assignationsIds = ['assignation-id'];
  const ctx = generateCtx({
    actions: {
      'dates.dates.getDatesByInstance': () => [],
    },
    models: {
      Dates: newModel(
        mongooseConnection,
        'Dates',
        getServiceModels().Dates.schema
      ),
    },
  });

  await ctx.tx.db.Dates.create({
    id: 'date1',
    deploymentID: 'deployment1',
    type: 'assignation',
    instance: 'assignation-id',
    name: 'start',
    date: new Date(),
  });

  // Act
  const result = await findAssignationDates({ assignationsIds, ctx });

  // Assert
  expect(result).toBeDefined();
  expect(result['assignation-id'].start).toBeDefined();
});
