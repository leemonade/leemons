const {
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { getTeacherInstances } = require('./getTeacherInstances');
const { teachersSchema } = require('../../../../models/teachers');

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
  jest.resetAllMocks();
});

it('Should call getTeacherInstances correctly', async () => {
  // Arrange

  const ctx = generateCtx({
    models: {
      Teachers: newModel(mongooseConnection, 'Teachers', teachersSchema),
    },
  });
  ctx.meta.userSession = {
    userAgents: [{ id: 'userAgentOne' }, { id: 'userAgentTwo' }],
  };
  const mockInstances = ['assignableInstanceOne', 'assignableInstanceTwo'];
  const initialValues = [
    {
      id: '1',
      teacher: ctx.meta.userSession.userAgents[0].id,
      assignableInstance: mockInstances[0],
      type: 'main-teacher',
    },
    {
      id: '2',
      teacher: ctx.meta.userSession.userAgents[0].id,
      assignableInstance: mockInstances[1],
      type: 'main-teacher',
    },
  ];
  await ctx.tx.db.Teachers.create(initialValues);
  const expectedResult = [
    'mockValueRepresentingAnInstanceObjectOne',
    'mockValueRepresentingAnInstanceObjectTwo',
  ];

  getInstancesData.mockResolvedValue({
    mockOne: expectedResult[0],
    mockTwo: expectedResult[1],
  });

  // Act
  const response = await getTeacherInstances({ ctx });

  // Assert
  expect(getInstancesData).toBeCalledWith({
    instances: expect.arrayContaining(mockInstances),
    ctx,
  });
  expect(response).toEqual(expectedResult);
});
