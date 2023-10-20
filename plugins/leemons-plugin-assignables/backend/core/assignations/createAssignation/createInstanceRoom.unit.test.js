const { it, expect } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
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

const testCases = [
  {
    title: 'Should create a new room if it does not exist multisubjects',
    classes: [
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
    ],
    expectedAction: 'comunica.room.add',
  },
  {
    title: 'Should create a new room if it does not exist',
    classes: [
      {
        subject: {
          name: 'subjectName',
        },
        program: 'program',
        color: '#color',
      },
    ],
    expectedAction: 'comunica.room.add',
  },
  {
    title: 'Should add user agents to the room if it already exists',
    classes: [
      {
        subject: {
          name: 'subjectName',
        },
        program: 'program',
        color: '#color',
      },
    ],
    roomExists: true,
    expectedAction: 'comunica.room.addUserAgents',
  },
  {
    title: 'Should not error if not users or teachers provided',
    classes: [
      {
        subject: {
          name: 'subjectName',
        },
        program: 'program',
        color: '#color',
      },
    ],
    teachers: [],
    users: [],
    roomExists: true,
    expectedAction: 'comunica.room.addUserAgents',
  },
];

testCases.forEach(
  ({
    title,
    classes,
    teachers = ['teacher1', 'teacher2'],
    users = ['user1', 'user2'],
    roomExists = false,
    expectedAction,
  }) => {
    it(title, async () => {
      // Arrange
      actions['comunica.room.exists'] = jest.fn(() => roomExists);

      const assignableInstanceId = 'assignableInstanceId';
      const instance = {
        assignable: {
          asset: {
            name: 'assetName',
          },
        },
      };

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
      expect(actions[expectedAction]).toHaveBeenCalled();
    });
  }
);
