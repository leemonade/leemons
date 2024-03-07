const {
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { unregisterDates } = require('./unregisterDates');
const { datesSchema } = require('../../models/dates');

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

it('Should remove the provided date', async () => {
  // Arrange
  const type = 'assignable';
  const instance = 'assignable-id';
  const name = 'start';

  const ctx = generateCtx({
    models: {
      Dates: newModel(mongooseConnection, 'Dates', datesSchema),
    },
  });

  const initialValue = {
    type,
    instance,
    name,
    date: new Date('2001/2/12'),
  };
  await ctx.db.Dates.create(initialValue);

  // Act
  const response = await unregisterDates({ type, instance, name, ctx });
  const databaseCount = await ctx.db.Dates.countDocuments({});

  // Assert
  expect(response).toBe(1);
  expect(databaseCount).toBe(0);
});

it('Should remove only all the provided dates', async () => {
  // Arrange
  const type = 'assignable';
  const instance = 'assignable-id';
  const names = ['start', 'deadline'];
  const otherName = 'another-name';

  const ctx = generateCtx({
    models: {
      Dates: newModel(mongooseConnection, 'Dates', datesSchema),
    },
  });

  const initialValue = [
    {
      type,
      instance,
      name: names[0],
      date: new Date('2001/2/1'),
    },
    {
      type,
      instance,
      name: names[1],
      date: new Date('2001/2/12'),
    },
    {
      type,
      instance,
      name: otherName,
    },
  ];
  await ctx.db.Dates.insertMany(initialValue);

  // Act
  const response = await unregisterDates({ type, instance, name: names, ctx });
  const databaseCount = await ctx.db.Dates.countDocuments({});
  const notDeleted = await ctx.db.Dates.findOne({ name: otherName }).lean();

  // Assert
  expect(response).toBe(2);
  expect(databaseCount).toBe(1);
  expect(notDeleted).not.toBeNull();
});

it('Should throw if no valid params are provided', async () => {
  // Arrange
  const type = 'assignable';
  const instance = 'assignable-id';
  const name = 'start';

  const ctx = generateCtx({
    models: {
      Dates: newModel(mongooseConnection, 'Dates', datesSchema),
    },
  });

  const initialValue = {
    type,
    instance,
    name,
    date: new Date('2001/2/12'),
  };
  await ctx.db.Dates.create(initialValue);

  // Act
  const noTypeFn = () =>
    unregisterDates({ type: undefined, instance, name, ctx });
  const noInstanceFn = () =>
    unregisterDates({ type, instance: undefined, name, ctx });
  const noNameFn = () =>
    unregisterDates({ type, instance, name: undefined, ctx });

  // Assert
  await expect(noTypeFn).rejects.toThrowError(
    'Cannot unregister dates: type, instance and name are required'
  );
  await expect(noInstanceFn).rejects.toThrowError(
    'Cannot unregister dates: type, instance and name are required'
  );
  await expect(noNameFn).rejects.toThrowError(
    'Cannot unregister dates: type, instance and name are required'
  );
});
