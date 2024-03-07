const {
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { getStudentAssignations } = require('./getStudentAssignations');
const { assignationsSchema } = require('../../../../models/assignations');

// MOCKS
jest.mock('./getInstancesData');
const { getInstancesData } = require('./getInstancesData');

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

it('Should call getStudentAssignations correctly', async () => {
  // Arrange
  const assignationOne = {
    id: 'assignationOne',
    instance: 'instanceOne',
    indexable: true,
    user: 'userOne',
    classes: ['classOne'],
  };
  const assignationTwo = {
    id: 'assignationTwo',
    instance: 'instanceTwo',
    indexable: true,
    user: 'userOne',
    classes: ['classOne'],
  };
  const mockInstances = {
    instanceOne: { id: 'instanceOne' },
    instanceTwo: { id: 'instanceTwo' },
  };

  const ctx = generateCtx({
    models: {
      Assignations: newModel(
        mongooseConnection,
        'Assignations',
        assignationsSchema
      ),
    },
  });
  ctx.meta.userSession = { userAgents: [{ id: 'userOne' }] };

  const assignations = [assignationOne, assignationTwo];
  await ctx.db.Assignations.create(assignations);

  getInstancesData.mockResolvedValue(mockInstances);

  // Act
  const response = await getStudentAssignations({ ctx });

  // Assert
  expect(getInstancesData).toBeCalledWith({
    instances: expect.arrayContaining(
      assignations.map((item) => item.instance)
    ),
    relatedInstances: undefined,
    ctx,
  });

  response.forEach((item) => {
    expect(item).toMatchObject({
      id: item.id === assignationOne.id ? assignationOne.id : assignationTwo.id,
      instance:
        item.id === assignationOne.id
          ? mockInstances.instanceOne
          : mockInstances.instanceTwo,
      user:
        item.id === assignationOne.id
          ? assignationOne.user
          : assignationTwo.user,
    });
    expect(item._id).toBeDefined();
  });
});
