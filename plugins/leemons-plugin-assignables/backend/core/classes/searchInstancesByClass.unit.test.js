const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { searchInstancesByClass } = require('./searchInstancesByClass');
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

it('Should find one instance', async () => {
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
  const response = await searchInstancesByClass({ id: classId, ctx });

  // Assert
  expect(response).toEqual([instanceId]);
});

it('Should find multiple instances', async () => {
  // Arrange
  const instanceId = 'instance-id';
  const instanceId2 = 'instance-id-2';
  const assignableId = 'assignable-id';
  const classId = 'class-id';

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
      assignableInstance: instanceId2,
      assignable: assignableId,
      class: classId,
    },
  ];
  await ctx.db.Classes.insertMany(initialValues);

  // Act
  const response = await searchInstancesByClass({ id: classId, ctx });

  // Assert
  expect(response).toEqual(expect.arrayContaining([(instanceId, instanceId2)]));
});

it("Should only find the requested classes' instances", async () => {
  // Arrange
  const instanceId = 'instance-id';
  const instanceId2 = 'instance-id-2';
  const instanceId3 = 'not-to-be-responded';
  const assignableId = 'assignable-id';
  const classId = 'class-id';

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
      assignableInstance: instanceId3,
      assignable: assignableId,
      class: 'another-class-id',
    },
  ];
  await ctx.db.Classes.insertMany(initialValues);

  // Act
  const response = await searchInstancesByClass({ id: classId, ctx });

  // Assert
  expect(response).not.toContain(instanceId3);
});
