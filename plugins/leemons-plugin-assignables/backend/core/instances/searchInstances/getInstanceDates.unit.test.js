const {
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { getInstanceDates } = require('./getInstanceDates');
const { datesSchema } = require('../../../models/dates');
const { getDatesObject } = require('../../../__fixtures__/getDatesObject');

const dates = { ...getDatesObject(), type: 'assignableInstance' };

let mongooseConnection;
let disconnectMongoose;
let ctx;

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

  ctx = generateCtx({
    models: {
      Dates: newModel(mongooseConnection, 'Dates', datesSchema),
    },
  });
});

it('Should return dates if instances have dates', async () => {
  // Arrange
  await ctx.tx.db.Dates.create(dates);

  const expectedResponse = {
    instanceId1: {
      start: dates.date,
    },
  };

  // Act
  const response = await getInstanceDates({ instances: ['instanceId1'], ctx });

  // Assert
  expect(response).toEqual(expectedResponse);
});

it('Should return empty object if instances have no dates', async () => {
  // Arrange

  // Act
  const response = await getInstanceDates({ instances: ['instanceId1'], ctx });

  // Assert
  expect(response).toEqual({});
});
