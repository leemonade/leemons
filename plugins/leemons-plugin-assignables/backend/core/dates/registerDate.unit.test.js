const {
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { registerDate } = require('./registerDate');
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

it('Should create a new date', async () => {
  // Arrange
  const type = 'instance';
  const instance = 'instance-id';
  const name = 'start';
  const date = new Date();
  const expectedValue = {
    type,
    instance,
    name,
    date,
  };

  const ctx = generateCtx({
    models: {
      Dates: newModel(mongooseConnection, 'Dates', datesSchema),
    },
  });

  // Act
  const response = await registerDate({ type, instance, name, date, ctx });
  const savedDate = await ctx.db.Dates.find({}).lean();

  // Assert
  expect(response).toEqual(expectedValue);
  expect(savedDate).toEqual([expect.objectContaining(expectedValue)]);
});

it('Should throw if no required params are provided', async () => {
  // Arrange
  const type = 'instance';
  const instance = 'instance-id';
  const name = 'start';
  const date = new Date();

  const ctx = generateCtx({
    models: {
      Dates: newModel(mongooseConnection, 'Dates', datesSchema),
    },
  });

  // Act
  const noTypeFn = () =>
    registerDate({ type: undefined, instance, name, date, ctx });
  const noInstanceFn = () =>
    registerDate({ type, instance: undefined, name, date, ctx });
  const noNameFn = () =>
    registerDate({ type, instance, name: undefined, date, ctx });
  const noDateFn = () =>
    registerDate({ type, instance, name, date: undefined, ctx });

  // Assert
  await expect(noTypeFn).rejects.toThrowError(
    'Cannot register date: type, instance, name and date are required'
  );
  await expect(noInstanceFn).rejects.toThrowError(
    'Cannot register date: type, instance, name and date are required'
  );
  await expect(noNameFn).rejects.toThrowError(
    'Cannot register date: type, instance, name and date are required'
  );
  await expect(noDateFn).rejects.toThrowError(
    'Cannot register date: type, instance, name and date are required'
  );
});
