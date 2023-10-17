const {
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { createInstance } = require('./createInstance');
const { instancesSchema } = require('../../../models/instances');
const {
  getInstanceObject,
} = require('../../../__fixtures__/getInstanceObject');

const { getAssignable } = require('../../assignables/getAssignable');
const {
  registerPermission,
} = require('../../permissions/instances/registerPermission');
const { registerClass } = require('../../classes/registerClass');
const { getTeachersOfGivenClasses } = require('./getTeachersOfGivenClasses');
const {
  addTeachersToAssignableInstance,
} = require('../../teachers/addTeachersToAssignableInstance');
const { createEventAndAddToUsers } = require('./createEventAndAddToUsers');
const { registerDates } = require('../../dates/registerDates');
const { updateInstance } = require('../updateInstance');
const {
  addPermissionToUser,
} = require('../../permissions/instances/users/addPermissionToUser');

jest.mock('../../assignables/getAssignable');
jest.mock('../../permissions/instances/registerPermission');
jest.mock('../../classes/registerClass');
jest.mock('./getTeachersOfGivenClasses');
jest.mock('../../teachers/addTeachersToAssignableInstance');
jest.mock('./createEventAndAddToUsers');
jest.mock('../../dates/registerDates');
jest.mock('../updateInstance');
jest.mock('../../permissions/instances/users/addPermissionToUser');
jest.mock('../../assignations/createAssignation');

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

it('Should create an assignable instance correctly', async () => {
  // Arrange
  const role = 'student';
  const assignable = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    role,
  };
  const instance = {
    ...getInstanceObject(),
    assignable: assignable.id,
    dates: { deadLine: new Date() },
    classes: [
      '123e4567-e89b-12d3-a456-426614174001',
      '123e4567-e89b-12d3-a456-426614174002',
    ],
    metadata: {},
    curriculum: {},
    relatedAssignables: [],
    students: ['student1', 'student2'],
    isAllDay: true,
    sendMail: true,
  };
  const teachers = [
    { teacher: 'teacherId1' },
    { teacher: 'teacherId2' },
    { teacher: 'teacherId3' },
  ];
  const eventId = 'eventId';

  const ctx = generateCtx({
    models: {
      Instances: newModel(mongooseConnection, 'Instances', instancesSchema),
    },
    events: {
      'instance.created': () => {},
      [`role.${role}.instance.created`]: () => {},
    },
  });

  getAssignable.mockResolvedValue(assignable);
  getTeachersOfGivenClasses.mockResolvedValue(teachers);
  createEventAndAddToUsers.mockResolvedValue(eventId);

  // Act
  const response = await createInstance({ assignableInstance: instance, ctx });

  const responseWithOutSomeParams = await createInstance({
    assignableInstance: {
      ...instance,
      id: 'test-id2',
      relatedAssignableInstances: {},
      students: [],
    },
    createEvent: false,
    ctx,
  });

  const dbInstances = await ctx.tx.db.Instances.find({}).lean();

  // Assert
  expect(getAssignable).toBeCalledWith({ id: assignable.id, ctx });
  expect(registerPermission).toBeCalledWith({
    assignableInstance: instance.id,
    assignable: assignable.id,
    ctx,
  });

  expect(registerClass).toBeCalledWith({
    instance: instance.id,
    assignable: assignable.id,
    id: instance.classes,
    ctx,
  });

  expect(getTeachersOfGivenClasses).toBeCalledWith({
    classes: instance.classes,
    ctx,
  });

  expect(getTeachersOfGivenClasses).toBeCalledWith({
    classes: instance.classes,
    ctx,
  });

  expect(createEventAndAddToUsers).toBeCalledWith({
    assignable,
    classes: instance.classes,
    dates: instance.dates,
    id: instance.id,
    isAllDay: instance.isAllDay,
    teachers,
    students: instance.students,
    ctx,
  });

  expect(addTeachersToAssignableInstance).toBeCalledWith({
    teachers,
    id: instance.id,
    assignable: assignable.id,
    ctx,
  });

  expect(registerDates).toBeCalledWith({
    type: 'assignableInstance',
    instance: instance.id,
    dates: instance.dates,
    ctx,
  });

  expect(updateInstance).toBeCalledWith({
    assignableInstance: {
      id: instance.id,
      relatedAssignableInstances: instance.relatedAssignableInstances,
    },
    ctx,
  });

  expect(addPermissionToUser).toBeCalledWith({
    assignableInstance: instance.id,
    assignable: assignable.id,
    userAgents: instance.students,
    role,
    ctx,
  });

  expect(response).toEqual({
    id: instance.id,
    students: instance.students,
    dates: instance.dates,
    classes: instance.classes,
    metadata: instance.metadata,
    curriculum: instance.curriculum,
    relatedAssignableInstances: instance.relatedAssignableInstances,
  });

  expect(responseWithOutSomeParams).toEqual({
    id: 'test-id2',
    students: [],
    dates: instance.dates,
    classes: instance.classes,
    metadata: instance.metadata,
    curriculum: instance.curriculum,
    relatedAssignableInstances: {},
  });

  expect(dbInstances).toHaveLength(2);
});
