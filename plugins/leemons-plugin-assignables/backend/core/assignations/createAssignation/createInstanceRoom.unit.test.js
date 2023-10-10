const { it, expect } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('leemons-testing');
const { newModel } = require('leemons-mongodb');
const { createInstanceRoom } = require('./createInstanceRoom');
const { assignablesSchema } = require('../../../models/assignables');
const { assignationsSchema } = require('../../../models/assignations');
const { classesSchema } = require('../../../models/classes');
const { datesSchema } = require('../../../models/dates');
const { instancesSchema } = require('../../../models/instances');
const { rolesSchema } = require('../../../models/roles');
const { gradesSchema } = require('../../../models/grades');

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

const actions = {
  'comunica.room.exists': jest.fn(() => false),
  'comunica.room.add': jest.fn(),
  'comunica.room.addUserAgents': jest.fn(),
  'comunica.room.get': jest.fn(),
};

it('Should create a new room if it does not exist multisubjects', async () => {
  // Arrange
  const assignableInstanceId = 'assignableInstanceId';
  const instance = {
    assignable: {
      asset: {
        name: 'assetName',
      },
    },
  };
  const classes = [
    {
      subject: {
        name: 'subjectName',
      },
      program: 'program',
      color: '#color',
    },
    {
      subject: {
        name: 'subjectName2',
      },
      program: 'program2',
      color: '#color2',
    },
  ];
  const teachers = ['teacher1', 'teacher2'];
  const users = ['user1', 'user2'];

  const ctx = generateCtx({
    actions,
    models: {
      Assignables: newModel(mongooseConnection, 'Assignables', assignablesSchema),
      Assignations: newModel(mongooseConnection, 'Assignations', assignationsSchema),
      Classes: newModel(mongooseConnection, 'Classes', classesSchema),
      Dates: newModel(mongooseConnection, 'Dates', datesSchema),
      Instances: newModel(mongooseConnection, 'Instances', instancesSchema),
      Roles: newModel(mongooseConnection, 'Roles', rolesSchema),
      Grades: newModel(mongooseConnection, 'Grades', gradesSchema),
    },
  });

  // Act
  await createInstanceRoom({
    assignableInstanceId,
    instance,
    classes,
    teachers,
    users,
    ctx,
  });

  // Assert
  expect(actions['comunica.room.add']).toHaveBeenCalled();
});

it('Should create a new room if it does not exist', async () => {
  // Arrange
  const assignableInstanceId = 'assignableInstanceId';
  const instance = {
    assignable: {
      asset: {
        name: 'assetName',
      },
    },
  };
  const classes = [
    {
      subject: {
        name: 'subjectName',
      },
      program: 'program',
      color: '#color',
    }
  ];
  const teachers = ['teacher1', 'teacher2'];
  const users = ['user1', 'user2'];

  const ctx = generateCtx({
    actions,
    models: {
      Assignables: newModel(mongooseConnection, 'Assignables', assignablesSchema),
      Assignations: newModel(mongooseConnection, 'Assignations', assignationsSchema),
      Classes: newModel(mongooseConnection, 'Classes', classesSchema),
      Dates: newModel(mongooseConnection, 'Dates', datesSchema),
      Instances: newModel(mongooseConnection, 'Instances', instancesSchema),
      Roles: newModel(mongooseConnection, 'Roles', rolesSchema),
      Grades: newModel(mongooseConnection, 'Grades', gradesSchema),
    },
  });

  // Act
  await createInstanceRoom({
    assignableInstanceId,
    instance,
    classes,
    teachers,
    users,
    ctx,
  });

  // Assert
  expect(actions['comunica.room.add']).toHaveBeenCalled();
});

it('Should add user agents to the room if it already exists', async () => {
  // Arrange
  actions['comunica.room.exists'] = jest.fn(() => true);

  const assignableInstanceId = 'assignableInstanceId';
  const instance = {
    assignable: {
      asset: {
        name: 'assetName',
      },
    },
  };
  const classes = [
    {
      subject: {
        name: 'subjectName',
      },
      program: 'program',
      color: '#color',
    },
  ];
  const teachers = ['teacher1', 'teacher2'];
  const users = ['user1', 'user2'];

  const ctx = generateCtx({
    actions,
    models: {
      Assignables: newModel(mongooseConnection, 'Assignables', assignablesSchema),
      Assignations: newModel(mongooseConnection, 'Assignations', assignationsSchema),
      Classes: newModel(mongooseConnection, 'Classes', classesSchema),
      Dates: newModel(mongooseConnection, 'Dates', datesSchema),
      Instances: newModel(mongooseConnection, 'Instances', instancesSchema),
      Roles: newModel(mongooseConnection, 'Roles', rolesSchema),
      Grades: newModel(mongooseConnection, 'Grades', gradesSchema),
    },
  });

  // Act
  await createInstanceRoom({
    assignableInstanceId,
    instance,
    classes,
    teachers,
    users,
    ctx,
  });

  // Assert
  expect(actions['comunica.room.addUserAgents']).toHaveBeenCalled();
});

it('Should not error if not users or teachers provided', async () => {
  // Arrange
  actions['comunica.room.exists'] = jest.fn(() => true);

  const assignableInstanceId = 'assignableInstanceId';
  const instance = {
    assignable: {
      asset: {
        name: 'assetName',
      },
    },
  };
  const classes = [
    {
      subject: {
        name: 'subjectName',
      },
      program: 'program',
      color: '#color',
    },
  ];
  const teachers = [];
  const users = [];

  const ctx = generateCtx({
    actions,
    models: {
      Assignables: newModel(mongooseConnection, 'Assignables', assignablesSchema),
      Assignations: newModel(mongooseConnection, 'Assignations', assignationsSchema),
      Classes: newModel(mongooseConnection, 'Classes', classesSchema),
      Dates: newModel(mongooseConnection, 'Dates', datesSchema),
      Instances: newModel(mongooseConnection, 'Instances', instancesSchema),
      Roles: newModel(mongooseConnection, 'Roles', rolesSchema),
      Grades: newModel(mongooseConnection, 'Grades', gradesSchema),
    },
  });

  // Act
  await createInstanceRoom({
    assignableInstanceId,
    instance,
    classes,
    teachers,
    users,
    ctx,
  });

  // Assert
  expect(actions['comunica.room.addUserAgents']).toHaveBeenCalled();
});