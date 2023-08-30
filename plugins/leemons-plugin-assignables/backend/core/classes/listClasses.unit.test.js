const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('leemons-testing');
const { newModel } = require('leemons-mongodb');

const { listClasses } = require('./listClasses');
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

describe('List by instance', () => {
  it('Should list the classes', async () => {
    // Arrange
    const assignableId = 'assignable-id';
    const instanceId = 'instance-id';
    const classId = 'class-id';

    const ctx = generateCtx({
      models: {
        Classes: newModel(mongooseConnection, 'Classes', classesSchema),
      },
    });

    const initialValue = {
      assignable: assignableId,
      assignableInstance: instanceId,
      class: classId,
    };
    await ctx.db.Classes.create(initialValue);

    // Act
    const response = await listClasses({ instance: instanceId, ctx });

    // Assert
    expect(response).toEqual([
      {
        assignable: assignableId,
        instance: instanceId,
        class: classId,
      },
    ]);
  });

  it('Should return an empty array when not found', async () => {
    // Arrange
    const instanceId = 'instance-id';

    const ctx = generateCtx({
      models: {
        Classes: newModel(mongooseConnection, 'Classes', classesSchema),
      },
    });

    // Act
    const response = await listClasses({ instance: instanceId, ctx });

    // Assert
    expect(response).toEqual([]);
  });
});

describe('List by assignable', () => {
  it('Should list the classes', async () => {
    // Arrange
    const assignableId = 'assignable-id';
    const instanceId = 'instance-id';
    const classId = 'class-id';

    const ctx = generateCtx({
      models: {
        Classes: newModel(mongooseConnection, 'Classes', classesSchema),
      },
    });

    const initialValue = {
      assignable: assignableId,
      assignableInstance: instanceId,
      class: classId,
    };
    await ctx.db.Classes.create(initialValue);

    // Act
    const response = await listClasses({ assignable: assignableId, ctx });

    // Assert
    expect(response).toEqual([
      {
        assignable: assignableId,
        instance: instanceId,
        class: classId,
      },
    ]);
  });

  it('Should return an empty array when not found', async () => {
    // Arrange
    const assignableId = 'assignable-id';

    const ctx = generateCtx({
      models: {
        Classes: newModel(mongooseConnection, 'Classes', classesSchema),
      },
    });

    // Act
    const response = await listClasses({ assignable: assignableId, ctx });

    // Assert
    expect(response).toEqual([]);
  });
});

it('Should throw an error if no assignable and instance are provided', () => {
  // Arrange
  const ctx = generateCtx({
    models: {
      Classes: newModel(mongooseConnection, 'Classes', classesSchema),
    },
  });

  // Act
  const testFn = () => listClasses({ ctx });

  // Assert
  expect(testFn).rejects.toThrowError('You must provide an assignable or an assignableInstance');
});
