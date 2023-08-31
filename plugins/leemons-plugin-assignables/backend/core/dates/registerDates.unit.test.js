const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('leemons-testing');
const { newModel } = require('leemons-mongodb');

const { registerDates } = require('./registerDates');
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

it('Should register each date', async () => {
  // Arrange
  const type = 'instance';
  const instance = 'instance-id';
  const dates = {
    start: new Date('2001/5/4'),
    deadline: new Date('2001/5/8'),
    correction: new Date('2001/5/9'),
  };

  const ctx = generateCtx({
    models: {
      Dates: newModel(mongooseConnection, 'Dates', datesSchema),
    },
  });

  // Act
  const response = await registerDates({ type, instance, dates, ctx });
  const savedValues = await ctx.db.Dates.find({}).lean();

  // Assert
  expect(response).toEqual({
    type,
    instance,
    dates,
  });

  expect(savedValues.sort()).toEqual(
    Object.entries(dates)
      .map(([name, date]) =>
        expect.objectContaining({
          type,
          instance,
          name,
          date,
        })
      )
      .sort()
  );
});

it('Should throw if not valid parameters are provided', async () => {
  // Arrange
  const type = 'instance';
  const instance = 'instance-id';
  const dates = {
    start: new Date('2001/5/4'),
    deadline: new Date('2001/5/8'),
    correction: new Date('2001/5/9'),
  };

  const ctx = generateCtx({
    models: {
      Dates: newModel(mongooseConnection, 'Dates', datesSchema),
    },
  });

  // Act
  const noTypeFn = () => registerDates({ type: undefined, instance, dates, ctx });
  const noInstanceFn = () => registerDates({ type, instance: undefined, dates, ctx });
  const noDatesFn = () => registerDates({ type, instance, dates: undefined, ctx });

  // Assert
  await expect(noTypeFn).rejects.toThrowError(
    'Cannot regster dates: type, instance and dates are required'
  );
  await expect(noInstanceFn).rejects.toThrowError(
    'Cannot regster dates: type, instance and dates are required'
  );
  await expect(noDatesFn).rejects.toThrowError(
    'Cannot regster dates: type, instance and dates are required'
  );
});
