const {
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { findDates } = require('./findDates');
const { datesSchema } = require('../../../models/dates');

const instanceId = 'instanceId';
const date = new Date();
const dates = [
  {
    type: 'assignableInstance',
    instance: instanceId,
    name: 'deadline',
    date,
  },
  {
    type: 'assignableInstance',
    instance: 'instanceId2',
    name: 'open',
    date,
  },
  {
    type: 'otherType',
    instance: instanceId,
    name: 'close',
    date,
  },
];

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

it('Should call findDates correctly', async () => {
  // Arrange

  const ctx = generateCtx({
    models: {
      Dates: newModel(mongooseConnection, 'Dates', datesSchema),
    },
  });

  await ctx.tx.db.Dates.create(dates);
  const expectedValue = { instanceId: { deadline: date } };

  // Act
  const response = await findDates({ instances: instanceId, ctx });

  // Assert
  expect(response).toEqual(expectedValue);
});
