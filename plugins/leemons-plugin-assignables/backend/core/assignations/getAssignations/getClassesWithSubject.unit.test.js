const { it, expect } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { getClassesWithSubject } = require('./getClassesWithSubject');
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

it('Should get classes with subject correctly', async () => {
  // Arrange
  const instancesIds = ['instance1', 'instance2'];
  const ctx = generateCtx({
    actions: {
      'academic-portfolio.classes.classByIds': () => [
        { id: 'class1', subject: { id: 'subject1' } },
        { id: 'class2', subject: { id: 'subject2' } },
      ],
    },
    models: {
      Classes: newModel(
        mongooseConnection,
        'Classes',
        getServiceModels().Classes.schema
      ),
    },
  });

  // Add classes to the Classes model
  await ctx.tx.db.Classes.create([
    { assignableInstance: 'instance1', class: 'class1' },
    { assignableInstance: 'instance2', class: 'class2' },
    { assignableInstance: 'instance2', class: 'class3' },
  ]);

  // Act
  const result = await getClassesWithSubject({ instancesIds, ctx });

  // Assert
  expect(result).toBeDefined();
  expect(result).toHaveProperty('instance1');
  expect(result.instance1.classes).toHaveLength(1);
  expect(result.instance1.classes[0]).toHaveProperty('id');
  expect(result.instance1.classes[0]).toHaveProperty('subject');
});
