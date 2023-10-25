const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');

const { LeemonsError } = require('@leemons/error');
const { newModel } = require('@leemons/mongodb');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');

const { getInstances } = require('./getInstances');
const { instancesSchema } = require('../../../models/instances');
const { getInstanceObject } = require('../../../__fixtures__/getInstanceObject');

const { getUserPermissions } = require('../../permissions/instances/users/getUserPermissions');
const { getRelatedInstances } = require('./getRelatedInstances');
const { listInstanceClasses } = require('../../classes/listInstanceClasses');
const { findDates } = require('./findDates');
const { getAssignables } = require('../../assignables/getAssignables');
const { getAssignationsData } = require('./getAssignationsData');
const { getInstancesSubjects } = require('./getInstancesSubjects');

jest.mock('../../permissions/instances/users/getUserPermissions');
jest.mock('./getRelatedInstances');
jest.mock('../../classes/listInstanceClasses');
jest.mock('./findDates');
jest.mock('../../assignables/getAssignables');
jest.mock('./getAssignationsData');
jest.mock('./getInstancesSubjects');

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
  jest.resetAllMocks();
  ctx = generateCtx({
    models: {
      Instances: newModel(mongooseConnection, 'Instances', instancesSchema),
    },
  });
});

const instance = getInstanceObject();
const instances = [
  {
    ...instance,
    id: 'instance1',
    assignable: 'assignable1',
    curriculum: 'curriculum1',
    metadata: { groupName: 'group1' },
  },
  {
    ...instance,
    id: 'instance2',
    assignable: 'assignable2',
    curriculum: 'curriculum2',
    metadata: { groupName: 'group2' },
  },
];

it('should return instances data', async () => {
  // Arrange

  getUserPermissions.mockReturnValue({
    instance1: { actions: ['edit', 'view'] },
    instance2: { actions: [] },
  });

  const expectedGetRelatedInstances = {
    instance1: {
      before: [{ id: 'beforeId1', instance: { id: 'beforeId1' } }],
      after: [{ id: 'afterId1', instance: { id: 'afterId1' } }],
    },
  };
  getRelatedInstances.mockReturnValue(expectedGetRelatedInstances);

  const expectedListInstanceClasses = {
    instance1: {
      instance: 'instance1',
      assignable: 'assignable1',
      class: 'class1',
    },
  };

  listInstanceClasses.mockReturnValue(expectedListInstanceClasses);

  const expectedFindDates = {
    instance1: {
      deadline: new Date(),
    },
  };
  findDates.mockReturnValue(expectedFindDates);

  const expectedGetAssignables = [{ id: 'assignable1' }];
  getAssignables.mockReturnValue(Promise.resolve(expectedGetAssignables));

  const expectedgetAssignationsData = {
    instance1: [{ user: 'student1' }],
  };
  getAssignationsData.mockReturnValue(expectedgetAssignationsData);

  const expectedGetInstancesSubject = {
    instance1: [{ id: 'subject1' }],
  };
  getInstancesSubjects.mockReturnValue(expectedGetInstancesSubject);

  await ctx.tx.db.Instances.create(instances);

  // Act
  const dbInstances = await ctx.tx.db.Instances.find({
    id: ['instance1'],
  }).lean();

  const result = await getInstances({
    ids: instances.map((el) => el.id),
    throwOnMissing: false,
    relatedAssignableInstances: true,
    details: true,
    ctx,
  });

  // Assert
  expect(getUserPermissions).toBeCalledWith({
    instancesIds: instances.map((el) => el.id),
    ctx,
  });
  expect(getRelatedInstances).toBeCalledWith({
    instances: dbInstances,
    details: true,
    ctx,
  });
  expect(listInstanceClasses).toBeCalledWith({
    id: ['instance1'],
    ctx,
  });
  expect(findDates).toBeCalledWith({
    instances: ['instance1'],
    ctx,
  });
  expect(getAssignables).toBeCalledWith({
    ids: ['assignable1'],
    ctx,
  });
  expect(getAssignationsData).toBeCalledWith({
    instances: ['instance1'],
    instancesTeached: { instance1: true, instance2: false },
    ctx,
  });
  expect(getInstancesSubjects).toBeCalledWith({
    classesPerInstance: expectedListInstanceClasses,
    ctx,
  });
  expect(result).toEqual(
    dbInstances.map((el) => ({
      ...el,
      assignable: { id: 'assignable1' },
      dates: expectedFindDates.instance1,
      relatedAssignableInstances: expectedGetRelatedInstances.instance1,
      students: expectedgetAssignationsData.instance1,
      classes: expectedListInstanceClasses.instance1,
      subjects: expectedGetInstancesSubject.instance1,
    }))
  );
});

it('should return instances data - alternative flow', async () => {
  // Arrange

  getUserPermissions.mockReturnValue({
    instance1: { actions: ['view'] },
  });

  await ctx.tx.db.Instances.create(instances);

  // Act
  const result = await getInstances({
    ids: instances.map((el) => el.id),
    ctx,
  });

  // Assert
  expect(getUserPermissions).toBeCalledWith({
    instancesIds: instances.map((el) => el.id),
    ctx,
  });
  expect(getRelatedInstances).not.toBeCalled();
  expect(findDates).not.toBeCalled();
  expect(getAssignables).not.toBeCalled();
  expect(getAssignationsData).not.toBeCalled();
  expect(getInstancesSubjects).not.toBeCalled();
  expect(result).toBeDefined();
});

it('should throw an error if missing permissions', async () => {
  // Arrange

  getUserPermissions.mockReturnValue({
    instance1: { actions: ['edit', 'view'] },
    instance2: { actions: [] },
  });

  // Act

  const testFunc = () => getInstances({ ids: instances, ctx });

  // Assert
  await expect(testFunc).rejects.toThrow(
    new LeemonsError(ctx, {
      message:
        "You don't have permissions to see some of the requested Instances or they do not exist",
    })
  );
});
