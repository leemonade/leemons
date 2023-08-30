const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('leemons-testing');
const { newModel } = require('leemons-mongodb');

const { registerClass } = require('./registerClass');
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

it('Should register one class', async () => {
  // Arrange
  const classId = 'class-id';
  const assignableId = 'assignable-id';
  const instanceId = 'instance-id';

  const expectedValue = {
    instance: instanceId,
    assignable: assignableId,
    classes: [classId],
  };
  const expectedStoredValue = {
    assignable: assignableId,
    assignableInstance: instanceId,
    class: classId,
  };

  const ctx = generateCtx({
    models: {
      Classes: newModel(mongooseConnection, 'Classes', classesSchema),
    },
  });

  // Act
  const response = await registerClass({
    id: classId,
    assignable: assignableId,
    instance: instanceId,
    ctx,
  });
  const classesSaved = await ctx.db.Classes.find({}).lean();

  // Assert
  expect(response).toEqual(expectedValue);
  expect(classesSaved[0]).toEqual(expect.objectContaining(expectedStoredValue));
  expect(classesSaved).toHaveLength(1);
});

it('Should register multiple classes', async () => {
  // Arrange
  const classIds = ['class-id-1', 'class-id-2'];
  const assignableId = 'assignable-id';
  const instanceId = 'instance-id';

  const expectedValue = {
    instance: instanceId,
    assignable: assignableId,
    classes: classIds,
  };
  const expectedStoredValue = [
    {
      assignable: assignableId,
      assignableInstance: instanceId,
      class: classIds[0],
    },
    {
      assignable: assignableId,
      assignableInstance: instanceId,
      class: classIds[1],
    },
  ];

  const ctx = generateCtx({
    models: {
      Classes: newModel(mongooseConnection, 'Classes', classesSchema),
    },
  });

  // Act
  const response = await registerClass({
    id: classIds,
    assignable: assignableId,
    instance: instanceId,
    ctx,
  });
  const classesSaved = await ctx.db.Classes.find({}).lean();

  // Assert
  expect(response).toEqual(expectedValue);
  expect(classesSaved[0]).toEqual(expect.objectContaining(expectedStoredValue[0]));
  expect(classesSaved[1]).toEqual(expect.objectContaining(expectedStoredValue[1]));
  expect(classesSaved).toHaveLength(2);
});

it('Should throw if a param is not provided', async () => {
  // Arrange
  const classId = 'class-id';
  const assignableId = 'assignable-id';
  const instanceId = 'instance-id';

  const ctx = generateCtx({
    models: {
      Classes: newModel(mongooseConnection, 'Classes', classesSchema),
    },
  });

  // Act
  const noIdFn = () =>
    registerClass({
      id: undefined,
      assignable: assignableId,
      instance: instanceId,
      ctx,
    });

  const noAssignableFn = () =>
    registerClass({
      id: classId,
      assignable: undefined,
      instance: instanceId,
      ctx,
    });

  const noInstanceFn = () =>
    registerClass({
      id: classId,
      assignable: assignableId,
      instance: undefined,
      ctx,
    });

  // Assert
  expect(noIdFn).rejects.toThrowError('id, instance and assignable are required');
  expect(noAssignableFn).rejects.toThrowError('id, instance and assignable are required');
  expect(noInstanceFn).rejects.toThrowError('id, instance and assignable are required');
});
