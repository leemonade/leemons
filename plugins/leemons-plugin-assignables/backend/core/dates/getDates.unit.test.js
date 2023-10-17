const {
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { getDates } = require('./getDates');
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

it('Should return an object with the instance dates', async () => {
  // Arrange
  const instanceId = 'instance-id';

  const ctx = generateCtx({
    models: {
      Dates: newModel(mongooseConnection, 'Dates', datesSchema),
    },
  });

  const initialValues = [
    {
      instance: instanceId,
      type: 'instance',
      name: 'start',
      date: new Date('2001/10/27'),
    },
    {
      instance: instanceId,
      type: 'instance',
      name: 'end',
      date: new Date('2001/10/28'),
    },
  ];
  await ctx.db.Dates.insertMany(initialValues);

  const expectedValue = {
    [initialValues[0].name]: initialValues[0].date,
    [initialValues[1].name]: initialValues[1].date,
  };

  // Act
  const response = await getDates({
    instance: instanceId,
    type: 'instance',
    ctx,
  });

  // Assert
  expect(response).toEqual(expectedValue);
});

it('Should return an object with the dates per instance', async () => {
  // Arrange
  const instanceId = 'instance-id';
  const instanceId2 = 'instance-id-2';

  const ctx = generateCtx({
    models: {
      Dates: newModel(mongooseConnection, 'Dates', datesSchema),
    },
  });

  const initialValues = [
    {
      instance: instanceId,
      type: 'instance',
      name: 'start',
      date: new Date('2010/10/27'),
    },
    {
      instance: instanceId,
      type: 'instance',
      name: 'end',
      date: new Date('2010/10/28'),
    },
    {
      instance: instanceId2,
      type: 'instance',
      name: 'start',
      date: new Date('2001/5/4'),
    },
    {
      instance: instanceId2,
      type: 'instance',
      name: 'end',
      date: new Date('2001/5/5'),
    },
  ];
  await ctx.db.Dates.insertMany(initialValues);

  const expectedValue = {
    [instanceId]: {
      [initialValues[0].name]: initialValues[0].date,
      [initialValues[1].name]: initialValues[1].date,
    },
    [instanceId2]: {
      [initialValues[2].name]: initialValues[2].date,
      [initialValues[3].name]: initialValues[3].date,
    },
  };

  // Act
  const response = await getDates({
    instance: [instanceId, instanceId2],
    type: 'instance',
    ctx,
  });

  // Assert
  expect(response).toEqual(expectedValue);
});

it('Should return empty object if no date is found for instance', async () => {
  // Arrange
  const instanceId = 'instance-id';

  const ctx = generateCtx({
    models: {
      Dates: newModel(mongooseConnection, 'Dates', datesSchema),
    },
  });

  // Act
  const response = await getDates({
    instance: instanceId,
    type: 'instance',
    ctx,
  });

  // Assert
  expect(response).toEqual({});
});

it('Should return empty object if no date is found in array instances', async () => {
  // Arrange
  const instanceId = 'instance-id';
  const instanceId2 = 'instance-id-2';

  const ctx = generateCtx({
    models: {
      Dates: newModel(mongooseConnection, 'Dates', datesSchema),
    },
  });

  // Act
  const response = await getDates({
    instance: [instanceId, instanceId2],
    type: 'instance',
    ctx,
  });

  // Assert
  expect(response).toEqual({});
});

it('Should throw if no instance or type are provided', async () => {
  // Arrange
  const instance = 'instance-id';
  const type = 'instance';

  const ctx = generateCtx({
    models: {
      Dates: newModel(mongooseConnection, 'Dates', datesSchema),
    },
  });
  // Act
  const noInstanceFn = () => getDates({ instance: undefined, type, ctx });
  const noTypeFn = () => getDates({ instance, type: undefined, ctx });

  // Assert
  await expect(noInstanceFn).rejects.toThrowError(
    'Cannot get dates: type and instance are required'
  );
  await expect(noTypeFn).rejects.toThrowError(
    'Cannot get dates: type and instance are required'
  );
});
