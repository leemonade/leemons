const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('leemons-testing');
const { newModel } = require('leemons-mongodb');

const { listInstanceClasses } = require('./listInstanceClasses');
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
  const response = await listInstanceClasses({ id: instanceId, ctx });

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
  const classId = 'class-id';
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
  const response = await listInstanceClasses({ id: instanceId, ctx });

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

it('Should list classes for multiple instances', async () => {
  // Arrange
  const instanceId = 'instance-id';
  const instanceId2 = 'instance-id-2';
  const assignableId = 'assignable-id';
  const classId = 'class-id';
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
    {
      assignableInstance: instanceId2,
      assignable: assignableId,
      class: classId,
    },
    {
      assignableInstance: instanceId2,
      assignable: assignableId,
      class: classId2,
    },
  ];
  await ctx.db.Classes.insertMany(initialValues);

  // Act
  const response = await listInstanceClasses({ id: [instanceId, instanceId2], ctx });

  // Assert
  expect(response).toEqual({
    [instanceId]: [classId, classId2],
    [instanceId2]: [classId, classId2],
  });
});
