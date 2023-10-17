const { it, expect } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { getGrades } = require('./getGrades');
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

it('Should get grades', async () => {
  // Arrange
  const assignationsData = [
    {
      user: 'userAgentId',
      id: 'assignation-id',
    },
    {
      user: 'NoneuserAgentId',
      id: 'assignation-id',
    },
  ];
  const ctx = generateCtx({
    actions: {
      'users.users.getUserAgentsInfo': () => [],
    },
    models: {
      Grades: newModel(
        mongooseConnection,
        'Grades',
        getServiceModels().Grades.schema
      ),
    },
  });

  await ctx.tx.db.Grades.create({
    id: 'grade-id',
    deploymentID: 'deployment-id',
    assignation: assignationsData[0].id,
    subject: 'subject',
    type: 'type',
    grade: 1,
    gradedBy: 'gradedBy',
    feedback: 'feedback',
    visibleToStudent: true,
  });

  // Act
  const result = await getGrades({ assignationsData, ctx });

  // Assert
  expect(result).toBeDefined();
  expect(result).toHaveProperty('assignation-id');
});
