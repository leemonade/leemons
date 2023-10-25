const {
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { getAssignationsDates } = require('./getAssignationsDates');
const { datesSchema } = require('../../../models/dates');
const { getDatesObject } = require('../../../__fixtures__/getDatesObject');

const date = getDatesObject();

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

it('Should return dates if has assignations', async () => {
  // Arrange
  await ctx.tx.db.Dates.create(date);

  const expectedResponse = { instanceId1: { start: date.date } };

  // Act
  const response = await getAssignationsDates({
    assignations: ['instanceId1'],
    ctx,
  });

  // Assert
  expect(response).toEqual(expectedResponse);
});

it('Should return empty object if no assignations', async () => {
  // Arrange

  // Act
  const response = await getAssignationsDates({ assignations: [], ctx });

  // Assert
  expect(response).toEqual({});
});
