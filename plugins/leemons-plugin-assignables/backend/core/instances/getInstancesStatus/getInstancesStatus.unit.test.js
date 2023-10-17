const {
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { getInstancesStatus } = require('./getInstancesStatus');
const {
  getInstanceObject,
} = require('../../../__fixtures__/getInstanceObject');
const {
  getAssignationObject,
} = require('../../../__fixtures__/getAssignationObject');
const { getGradeObject } = require('../../../__fixtures__/getGradeObject');

const { instancesSchema } = require('../../../models/instances');
const { assignationsSchema } = require('../../../models/assignations');
const { gradesSchema } = require('../../../models/grades');

const {
  getUserPermissionMultiple,
} = require('../../permissions/instances/users/getUserPermissionMultiple');
const { getDates } = require('../../dates');

jest.mock('../../permissions/instances/users/getUserPermissionMultiple');
jest.mock('../../dates');

const instance = getInstanceObject();
const assignation = getAssignationObject();

let mongooseConnection;
let disconnectMongoose;
let ctx;
let assignableInstanceIds;
let instances;
let assignations;

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

  ctx = generateCtx({
    models: {
      Instances: newModel(mongooseConnection, 'Instances', instancesSchema),
      Assignations: newModel(
        mongooseConnection,
        'Assignations',
        assignationsSchema
      ),
      Grades: newModel(mongooseConnection, 'Grades', gradesSchema),
    },
  });
});

it('Should return student instances status', async () => {
  // Arrange

  assignableInstanceIds = ['instanceId1', 'instanceId2'];
  instances = assignableInstanceIds.map((id) => ({ ...instance, id }));
  await ctx.tx.db.Instances.create(instances);

  assignations = assignableInstanceIds.map((id) => ({
    ...assignation,
    instance: id,
    id: `assignationId${id}`,
  }));
  await ctx.tx.db.Assignations.create([
    ...assignations,
    {
      ...assignations[0],
      id: 'assignationIdinstanceId3',
      instance: 'instanceId1',
    },
  ]);

  const { grades } = getGradeObject();
  await ctx.tx.db.Grades.create([...grades, { ...grades[0], id: 'grade3' }]);

  const date = new Date();
  const expectedValue = [
    {
      instance: 'instanceId1',
      assignation: 'assignationIdinstanceId1',
      status: 'evaluated',
      dates: { start: date, end: date },
      alwaysAvailable: true,
      timestamps: { start: date, end: date },
    },
    {
      instance: 'instanceId1',
      assignation: 'assignationIdinstanceId3',
      status: 'opened',
      dates: { start: date, end: date },
      alwaysAvailable: true,
      timestamps: {},
    },
    {
      instance: 'instanceId2',
      assignation: 'assignationIdinstanceId2',
      status: 'opened',
      dates: {},
      alwaysAvailable: true,
      timestamps: {},
    },
  ];

  getUserPermissionMultiple.mockResolvedValue([
    {
      actions: ['view'],
      assignableInstance: 'instanceId1',
    },
    {
      actions: ['edit', 'view'],
      assignableInstance: 'instanceId2',
    },
  ]);
  getDates
    .mockResolvedValueOnce({
      instanceId1: { start: date, end: date },
    })
    .mockResolvedValueOnce({
      assignationIdinstanceId1: { start: date, end: date },
    });

  // Act
  const response = await getInstancesStatus({ assignableInstanceIds, ctx });
  // Assert

  expect(getUserPermissionMultiple).toBeCalledWith({
    assignableInstances: assignableInstanceIds,
    ctx,
  });

  expect(response.length).toBe(3);
  expect(response).toEqual(expect.arrayContaining(expectedValue));
});

it('Should return teatcher instances status', async () => {
  // Arrange
  assignableInstanceIds = ['instanceId1', 'instanceId2'];
  instances = assignableInstanceIds.map((id) => ({ ...instance, id }));
  await ctx.tx.db.Instances.create(instances);

  //   assignations = assignableInstanceIds.map((id) => ({
  //     ...assignation,
  //     instance: id,
  //     id: `assignationId${id}`,
  //   }));
  //   await ctx.tx.db.Assignations.create([
  //     ...assignations,
  //     { ...assignations[0], id: 'assignationIdinstanceId3', instance: 'instanceId1' },
  //   ]);

  const { grades } = getGradeObject();
  await ctx.tx.db.Grades.create([...grades, { ...grades[0], id: 'grade3' }]);
  const date = new Date();
  const expectedValue = [
    {
      instance: 'instanceId1',
      assignation: null,
      status: null,
      dates: {},
      alwaysAvailable: true,
      timestamps: null,
    },
  ];

  getUserPermissionMultiple.mockResolvedValue([
    {
      actions: ['view', 'edit'],
      assignableInstance: 'instanceId1',
    },
    {
      actions: ['view'],
      assignableInstance: 'instanceId2',
    },
  ]);
  getDates
    .mockResolvedValueOnce({
      instanceId2: { start: date },
    })
    .mockResolvedValueOnce({
      assignationIdinstanceId2: { start: date },
    });

  // Act
  const response = await getInstancesStatus({ assignableInstanceIds, ctx });
  // Assert

  expect(getUserPermissionMultiple).toBeCalledWith({
    assignableInstances: assignableInstanceIds,
    ctx,
  });

  expect(response).toEqual(expectedValue);
});

it('Should throw Error if some instance does not have view permissions', async () => {
  // Arrange

  getUserPermissionMultiple.mockResolvedValue([
    {
      actions: ['edit'],
      assignableInstance: 'instanceId1',
    },
  ]);

  // Act
  const testFunc = () =>
    getInstancesStatus({ assignableInstanceIds: 'instanceId1', ctx });
  // Assert

  await expect(testFunc).rejects.toThrowError(
    /You do not have permissions to view the instance/
  );
});
