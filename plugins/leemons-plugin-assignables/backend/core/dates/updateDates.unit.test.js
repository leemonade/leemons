const {
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { updateDates } = require('./updateDates');
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

it('Should add the new dates', async () => {
  // Arrange
  const instance = 'instance-id';
  const type = 'type-id';
  const dates = {
    start: new Date('2023/8/29'),
    end: new Date('2023/10/12'),
  };

  const ctx = generateCtx({
    models: {
      Dates: newModel(mongooseConnection, 'Dates', datesSchema),
    },
  });

  // Act
  const response = await updateDates({ instance, type, dates, ctx });
  const savedDates = await ctx.db.Dates.find({}).lean();

  // Assert
  expect(response).toEqual({
    type,
    instance,
    updatedDates: [],
    newDates: Object.keys(dates),
    removedDates: [],
  });

  expect(savedDates.sort()).toEqual(
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

// TODO: Re-enable this test once the function is checked
it.skip('Should remove the old dates', async () => {
  // Arrange
  const instance = 'instance-id';
  const type = 'type-id';
  const dates = {
    start: new Date('2023/8/29'),
    end: new Date('2023/10/12'),
  };

  const ctx = generateCtx({
    models: {
      Dates: newModel(mongooseConnection, 'Dates', datesSchema),
    },
  });

  const initialValues = Object.entries(dates).map(([name, date]) => ({
    type,
    instance,
    name,
    date,
  }));
  await ctx.db.Dates.insertMany(initialValues);

  // Act
  const response = await updateDates({
    instance,
    type,
    dates: {},
    ctx,
  });
  const savedDatesCount = await ctx.db.Dates.countDocuments({});

  // Assert
  expect(response).toEqual({
    type,
    instance,
    updatedDates: [],
    newDates: [],
    removedDates: Object.keys(dates),
  });

  expect(savedDatesCount).toBe(0);
});

it("Should update the date if it's changed", async () => {
  // Arrange
  const instance = 'instance-id';
  const type = 'type-id';
  const dates = {
    start: new Date('2023/8/29'),
    end: new Date('2023/10/12'),
  };
  const newDates = {
    start: new Date('2024/8/29'),
    end: new Date('2024/10/12'),
  };

  const ctx = generateCtx({
    models: {
      Dates: newModel(mongooseConnection, 'Dates', datesSchema),
    },
  });

  await ctx.db.Dates.insertMany(
    Object.entries(dates).map(([name, date]) => ({
      type,
      instance,
      name,
      date,
    }))
  );

  // Act
  const response = await updateDates({ instance, type, dates: newDates, ctx });
  const savedDates = await ctx.db.Dates.find({});

  // Assert
  expect(response).toEqual({
    type,
    instance,
    newDates: [],
    updatedDates: Object.keys(newDates),
    removedDates: [],
  });

  expect(savedDates.sort()).toEqual(
    Object.entries(newDates)
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

it('Should throw an error if no valid params areprovided', async () => {
  // Arrange
  const instance = 'instance-id';
  const type = 'type-id';
  const dates = {
    start: new Date('2023/8/29'),
    end: new Date('2023/10/12'),
  };

  const ctx = generateCtx({
    models: {
      Dates: newModel(mongooseConnection, 'Dates', datesSchema),
    },
  });

  // Act
  const noTypeFn = () => updateDates({ type: undefined, instance, dates, ctx });
  const noInstanceFn = () =>
    updateDates({ type, instance: undefined, dates, ctx });
  const noDatesFn = () =>
    updateDates({ type, instance, dates: undefined, ctx });

  // Assert
  await expect(noTypeFn).rejects.toThrowError(
    'Cannot update dates: type, instance and dates are required'
  );
  await expect(noInstanceFn).rejects.toThrowError(
    'Cannot update dates: type, instance and dates are required'
  );
  await expect(noDatesFn).rejects.toThrowError(
    'Cannot update dates: type, instance and dates are required'
  );
});
