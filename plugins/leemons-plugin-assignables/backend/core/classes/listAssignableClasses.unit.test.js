const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { listAssignableClasses } = require('./listAssignableClasses');
const { classesSchema } = require('../../models/classes');

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

const testCases = [
  {
    description: 'Should list one class',
    initialValues: [
      {
        assignableInstance: 'instance-id',
        assignable: 'assignable-id',
        class: 'class-id',
      },
    ],
    expected: [
      {
        instance: 'instance-id',
        assignable: 'assignable-id',
        class: 'class-id',
      },
    ],
  },
  {
    description: 'Should list multiple classes',
    initialValues: [
      {
        assignableInstance: 'instance-id',
        assignable: 'assignable-id',
        class: 'class-id-1',
      },
      {
        assignableInstance: 'instance-id',
        assignable: 'assignable-id',
        class: 'class-id-2',
      },
    ],
    expected: [
      {
        instance: 'instance-id',
        assignable: 'assignable-id',
        class: 'class-id-1',
      },
      {
        instance: 'instance-id',
        assignable: 'assignable-id',
        class: 'class-id-2',
      },
    ],
  },
];

testCases.forEach(({ description, initialValues, expected }) => {
  it(description, async () => {
    // Arrange
    const ctx = generateCtx({
      models: {
        Classes: newModel(mongooseConnection, 'Classes', classesSchema),
      },
    });

    await ctx.db.Classes.insertMany(initialValues);

    // Act
    const response = await listAssignableClasses({ id: initialValues[0].assignable, ctx });

    // Assert
    expect(response).toEqual(expect.arrayContaining(expected));
  });
});
