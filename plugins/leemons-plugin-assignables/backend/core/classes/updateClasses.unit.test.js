const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { updateClasses } = require('./updateClasses');
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

it('Should add the new classes', async () => {
  const instanceId = 'instance-id';
  const assignableId = 'assignable-id';
  const ids = ['class-id-1', 'class-id-2'];
  // Arrange
  const ctx = generateCtx({
    models: {
      Classes: newModel(mongooseConnection, 'Classes', classesSchema),
    },
  });

  // Act
  const response = await updateClasses({
    instance: instanceId,
    assignable: assignableId,
    ids,
    ctx,
  });
  const classesInDb = await ctx.db.Classes.find({}).lean();

  // Assert
  expect(response).toEqual({
    added: ids,
    removed: [],
  });

  expect(classesInDb).toEqual(
    expect.arrayContaining(
      ids.map((id) =>
        expect.objectContaining({
          assignableInstance: instanceId,
          assignable: assignableId,
          class: id,
        })
      )
    )
  );
});

it('Should remove the old classes', async () => {
  const instanceId = 'instance-id';
  const assignableId = 'assignable-id';
  const classId = 'class-id';
  // Arrange
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
  const response = await updateClasses({
    instance: instanceId,
    assignable: assignableId,
    ids: [],
    ctx,
  });
  const classesCountInDb = await ctx.db.Classes.countDocuments({});

  // Assert
  expect(response).toEqual({
    added: [],
    removed: [classId],
  });

  expect(classesCountInDb).toBe(0);
});
