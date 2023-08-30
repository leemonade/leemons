const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('leemons-testing');
const { newModel } = require('leemons-mongodb');

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

it('Should list one class', async () => {
  // Arrange
  const instanceId = 'instance-id';
  const assignableId = 'assignable-id';
  const classId = 'class-id';

  const ctx = generateCtx({
    models: {
      Classes: newModel(mongooseConnection, 'Classes', classesSchema),
    },
  });

  const initialValue = {
    assignableInstance: instanceId,
    assignable: assignableId,
    class: classId,
  };
  await ctx.db.Classes.create(initialValue);

  // Act
  const response = await listAssignableClasses({ id: assignableId, ctx });

  // Assert
  expect(response).toEqual([
    {
      instance: instanceId,
      assignable: assignableId,
      class: classId,
    },
  ]);
});

it('Should list multiple classes', async () => {
  // Arrange
  const instanceId = 'instance-id';
  const assignableId = 'assignable-id';
  const classId = 'class-id-1';
  const classId2 = 'class-id-2';

  const ctx = generateCtx({
    models: {
      Classes: newModel(mongooseConnection, 'Classes', classesSchema),
    },
  });

  const initialValues = [
    {
      assignableInstance: instanceId,
      assignable: assignableId,
      class: classId,
    },
    {
      assignableInstance: instanceId,
      assignable: assignableId,
      class: classId2,
    },
  ];
  await ctx.db.Classes.insertMany(initialValues);

  // Act
  const response = await listAssignableClasses({ id: assignableId, ctx });

  // Assert
  expect(response.sort()).toEqual(
    [
      {
        instance: instanceId,
        assignable: assignableId,
        class: classId,
      },
      {
        instance: instanceId,
        assignable: assignableId,
        class: classId2,
      },
    ].sort()
  );
});
