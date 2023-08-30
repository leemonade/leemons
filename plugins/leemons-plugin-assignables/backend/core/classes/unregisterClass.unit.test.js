const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('leemons-testing');
const { newModel } = require('leemons-mongodb');

const { unregisterClass } = require('./unregisterClass');
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

it('Should unregister the class', async () => {
  // Arrange
  const instanceId = 'instance-id';
  const assignableId = 'assignable-id';
  const classId = 'class-id';
  const documentCountShouldBeDeleted = 1;

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
  const response = await unregisterClass({ instance: instanceId, id: classId, ctx });
  const documentsCount = await ctx.db.Classes.countDocuments({});

  // Assert
  expect(documentsCount).toBe(0);
  expect(response).toBe(documentCountShouldBeDeleted);
});

it('Should unregister multiple classes', async () => {
  // Arrange
  const instanceId = 'instance-id';
  const assignableId = 'assignable-id';
  const classIds = ['class-id-1', 'class-id-2'];
  const documentCountShouldBeDeleted = classIds.length;

  const ctx = generateCtx({
    models: {
      Classes: newModel(mongooseConnection, 'Classes', classesSchema),
    },
  });

  const initialValues = classIds.map((id) => ({
    assignableInstance: instanceId,
    assignable: assignableId,
    class: id,
  }));
  await ctx.db.Classes.insertMany(initialValues);

  // Act
  const response = await unregisterClass({ instance: instanceId, id: classIds, ctx });
  const documentsCount = await ctx.db.Classes.countDocuments({});

  // Assert
  expect(documentsCount).toBe(0);
  expect(response).toBe(documentCountShouldBeDeleted);
});

it('Should not unregister all the classes in the table', async () => {
  // Arrange
  const instanceId = 'instance-id';
  const assignableId = 'assignable-id';
  const classId = 'class-id-1';

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
      class: 'class-id-not-to-remove',
    },
    {
      assignableInstance: 'other-instance-id',
      assignable: 'other-assignable-id',
      class: classId,
    },
  ];
  const valueCountNotToBeDeleted = 2;

  await ctx.db.Classes.insertMany(initialValues);

  // Act
  const response = await unregisterClass({ instance: instanceId, id: classId, ctx });
  const documentsCount = await ctx.db.Classes.countDocuments({});

  // Assert
  expect(response).toBe(1);
  expect(documentsCount).toBe(valueCountNotToBeDeleted);
});
