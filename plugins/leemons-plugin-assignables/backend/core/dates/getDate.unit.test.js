const {
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { getDate } = require('./getDate');
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

it('Should return one date', async () => {
  // Arrange
  const type = 'instance';
  const instance = 'instance-id';
  const name = 'start';
  const date = new Date('2012/10/27');

  const ctx = generateCtx({
    models: {
      Dates: newModel(mongooseConnection, 'Dates', datesSchema),
    },
  });

  const initialValues = [
    {
      type,
      instance,
      name,
      date,
    },
    {
      type,
      instance,
      name: 'end',
      date: new Date('2012/11/5'),
    },
    {
      type: 'assignable',
      instance,
      name,
      date: new Date('2012/11/30'),
    },
    {
      type: 'assignable',
      instance: 'assignable-id',
      name,
      date: new Date('2012/12/4'),
    },
  ];
  await ctx.db.Dates.create(initialValues);

  // Act
  const response = await getDate({ type, instance, name, ctx });

  // Assert
  expect(response).toEqual(date);
});

it('Should return null when no date is foun', async () => {
  // Arrange
  const type = 'instance';
  const instance = 'instance-id';
  const name = 'start';

  const ctx = generateCtx({
    models: {
      Dates: newModel(mongooseConnection, 'Dates', datesSchema),
    },
  });

  // Act
  const response = await getDate({ type, instance, name, ctx });

  // Assert
  expect(response).toBeNull();
});

it('Should throw if no valid params are provided', async () => {
  // Arrange
  const type = 'instance';
  const instance = 'instance-id';
  const name = 'start';

  const ctx = generateCtx({
    models: {
      Dates: newModel(mongooseConnection, 'Dates', datesSchema),
    },
  });

  // Act
  const noTypeFn = () => getDate({ type: undefined, instance, name, ctx });
  const noInstanceFn = () => getDate({ type, instance: undefined, name, ctx });
  const noNameFn = () => getDate({ type, instance, name: undefined, ctx });

  // Assert
  await expect(noTypeFn).rejects.toThrowError(
    'Cannot get dates: type, instance and name are required'
  );
  await expect(noInstanceFn).rejects.toThrowError(
    'Cannot get dates: type, instance and name are required'
  );
  await expect(noNameFn).rejects.toThrowError(
    'Cannot get dates: type, instance and name are required'
  );
});
