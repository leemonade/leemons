const {
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { getActivitiesByProfile } = require('./getActivitiesByProfile');
const { teachersSchema } = require('../../../models/teachers');
const { assignationsSchema } = require('../../../models/assignations');
const { getTeacherObject } = require('../../../__fixtures__/getTeacherObject');
const {
  getAssignationObject,
} = require('../../../__fixtures__/getAssignationObject');

const teacher = getTeacherObject();
const assignation = getAssignationObject();

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
      Teachers: newModel(mongooseConnection, 'Teachers', teachersSchema),
      Assignations: newModel(
        mongooseConnection,
        'Assigntions',
        assignationsSchema
      ),
    },
  });
});

it('Should return instances if has teacher instances', async () => {
  // Arrange
  await ctx.tx.db.Teachers.create(teacher);

  const expectedResponse = {
    assignableInstances: ['assignableId1'],
    isTeacher: true,
  };

  // Act
  const response = await getActivitiesByProfile({ ctx });

  // Assert
  expect(response).toEqual(expectedResponse);
});

it('Should return assignations if has student assignations', async () => {
  // Arrange
  await ctx.tx.db.Assignations.create(assignation);

  // Act
  const resp = await getActivitiesByProfile({ ctx });

  // Assert
  expect(resp.assignations[0].id).toEqual('test-id');
  expect(resp.isTeacher).toBe(false);
});

it('Should return empty array if no have teacher instances or student assignations', async () => {
  // Arrange

  // Act
  const resp = await getActivitiesByProfile({ ctx });

  // Assert
  expect(resp).toEqual({ assignableInstances: [] });
});
