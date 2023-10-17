const { it, expect } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const {
  getRelatedAssignationsTimestamps,
} = require('./getRelatedAssignationsTimestamps');
const { getServiceModels } = require('../../../models');

jest.mock('./getRelatedAssignations', () => ({
  getRelatedAssignations: () => ({
    assignation2: [{ id: 'assignation1' }],
    assignation3: [{ id: 'assignation1' }],
    assignation4: [{ id: 'assignation2' }],
  }),
}));
jest.mock('./findAssignationDates', () => ({
  findAssignationDates: () => ({ assignation1: { start: new Date() } }),
}));

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

it('Should get related assignations timestamps', async () => {
  // Arrange
  const assignationsData = {
    /* mock data */
  };
  const ctx = generateCtx({
    actions: {
      // mock actions
    },
    models: {
      Assignations: newModel(
        mongooseConnection,
        'Assignations',
        getServiceModels().Assignations.schema
      ),
    },
  });

  // Act
  const result = await getRelatedAssignationsTimestamps({
    assignationsData,
    ctx,
  });

  // Assert
  expect(result).toBeDefined();
  expect(result).toHaveProperty('assignation2');
  expect(result).toHaveProperty('assignation3');
  expect(result).toHaveProperty('assignation4');
});
