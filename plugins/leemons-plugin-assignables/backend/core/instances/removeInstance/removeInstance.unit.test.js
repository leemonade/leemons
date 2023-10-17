const {
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { removeInstance } = require('./removeInstance');

const { instancesSchema } = require('../../../models/instances');
const {
  getInstanceObject,
} = require('../../../__fixtures__/getInstanceObject');

const { unregisterClass } = require('../../classes');
const { unregisterDates } = require('../../dates');
const { getInstance } = require('../getInstance');
const {
  removePermission,
} = require('../../permissions/instances/removePermission');

jest.mock('../../classes/unregisterClass');
jest.mock('../../dates/unregisterDates');
jest.mock('../getInstance');
jest.mock('../../permissions/instances/removePermission');

const removeEventHandler = jest.fn();

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
    actions: {
      'calendar.calendar.removeEvent': removeEventHandler,
    },
    models: {
      Instances: newModel(mongooseConnection, 'Instances', instancesSchema),
    },
  });
});

it('Should remove instance successfully', async () => {
  // Arrange
  const instanceId = 'testInstanceId1';
  const instance = {
    ...getInstanceObject(),
    id: instanceId,
    relatedAssignableInstances: { before: { id: 'relatedAssignableId1' } },
  };
  const relatedInstance = {
    ...getInstanceObject(),
    id: 'relatedAssignableId1',
    relatedAssignableInstances: {},
    event: undefined,
  };
  await ctx.tx.db.Instances.create(instance, relatedInstance);

  getInstance
    .mockResolvedValueOnce({
      ...instance,
      relatedAssignableInstances: ['relatedAssignableId1'],
    })
    .mockResolvedValueOnce({
      ...relatedInstance,
      relatedAssignableInstances: [],
    });

  // Act
  const response = await removeInstance({
    assignableInstanceId: instanceId,
    ctx,
  });

  // Assert
  expect(getInstance).toBeCalledWith({ id: instanceId, details: true, ctx });
  expect(removeEventHandler).toBeCalledWith({ id: instance.event });
  expect(unregisterDates).toBeCalledWith({
    type: 'assignableInstance',
    instance: instanceId,
    name: Object.keys(instance.dates),
    ctx,
  });
  expect(unregisterClass).toBeCalledWith({
    instance: instanceId,
    id: instance.classes,
    ctx,
  });
  expect(removePermission).toBeCalledWith({
    assignableInstance: instanceId,
    assignable: instance.assignable.id,
    ctx,
  });
  expect(response.deletedCount).toEqual(1);

  // nos aseguramos que se haya borrado también la relatedAssignableInstance
  const instancesDB = await ctx.tx.db.Instances.find().lean();
  expect(instancesDB.length).toBe(0);
});
