const { it, expect } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { getRelatedAssignations } = require('./getRelatedAssignations');
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

it('Should get related assignations', async () => {
  // Arrange
  const assignationsData = [
    { id: 'assignation1', instance: 'instance1', user: 'user1' },
    { id: 'assignation2', instance: 'instance2', user: 'user1' },
    { id: 'assignation3', instance: 'instance2', user: 'user1' },
  ];
  const ctx = generateCtx({
    actions: {
      'instances.instances.getInstance': () => ({
        id: 'instance1',
        relatedAssignableInstances: JSON.stringify({
          before: [{ id: 'instance2' }],
        }),
      }),
    },
    models: {
      Assignations: newModel(
        mongooseConnection,
        'Assignations',
        getServiceModels().Assignations.schema
      ),
      Instances: newModel(
        mongooseConnection,
        'Instances',
        getServiceModels().Instances.schema
      ),
    },
  });

  // Add data to the Instances table
  await ctx.tx.db.Instances.create({
    id: 'instance1',
    relatedAssignableInstances: JSON.stringify({
      before: [{ id: 'instance2' }],
    }),
    deploymentID: 'deployment1',
    assignable: 'assignable1',
    alwaysAvailable: true,
    gradable: false,
    requiresScoring: false,
    allowFeedback: false,
    showResults: true,
    showCorrectAnswers: true,
    addNewClassStudents: false,
  });
  await ctx.tx.db.Instances.create({
    id: 'instance2',
    relatedAssignableInstances: JSON.stringify({
      before: [{ id: 'instance1' }],
    }),
    deploymentID: 'deployment2',
    assignable: 'assignable2',
    alwaysAvailable: true,
    gradable: false,
    requiresScoring: false,
    allowFeedback: false,
    showResults: true,
    showCorrectAnswers: true,
    addNewClassStudents: false,
  });

  // Add data to the Assignations table
  await ctx.tx.db.Assignations.create({
    id: 'assignation1',
    instance: 'instance1',
    user: 'user1',
    deploymentID: 'deployment1',
    indexable: true,
    classes: {},
    metadata: {},
    emailSended: false,
    rememberEmailSended: true,
  });
  await ctx.tx.db.Assignations.create({
    id: 'assignation2',
    instance: 'instance2',
    user: 'user1',
    deploymentID: 'deployment2',
    indexable: true,
    classes: {},
    metadata: {},
    emailSended: false,
    rememberEmailSended: true,
  });

  // Act
  const result = await getRelatedAssignations({ assignationsData, ctx });

  // Assert
  expect(result).toBeDefined();
  expect(result).toHaveProperty('assignation1');
  expect(result).toHaveProperty('assignation2');
});
