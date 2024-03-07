const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { createSubjectsRooms } = require('./createSubjectsRooms');
const { assignablesSchema } = require('../../../models/assignables');
const { assignationsSchema } = require('../../../models/assignations');
const { classesSchema } = require('../../../models/classes');
const { datesSchema } = require('../../../models/dates');
const { gradesSchema } = require('../../../models/grades');
const { instancesSchema } = require('../../../models/instances');
const { rolesSchema } = require('../../../models/roles');

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
  'comunica.room.add': jest.fn(() => {}),
  'comunica.room.addUserAgents': jest.fn(() => {}),
  'comunica.room.get': jest.fn(() => {}),
};

const testCases = [
  {
    title: 'Should create a new room if it does not exist',
    roomExists: false,
    teachers: [],
  },
  {
    title: 'Should add extra students to the room if it already exists',
    roomExists: true,
    teachers: ['teacher1', 'teacher2'],
  },
  {
    title: 'Should add extra students to the room if it already exists without teachers',
    roomExists: true,
    teachers: [],
  },
];

testCases.forEach(({ title, roomExists, teachers }) => {
  it(title, async () => {
    // Arrange
    actions['comunica.room.exists'] = jest.fn(() => roomExists);
    const assignableInstanceId = 'assignableInstanceId';
    const instance = {
      assignable: {
        asset: {
          name: 'assetName',
          id: 'assetId',
        },
      },
    };
    const parentKey = 'parentKey';
    const classes = [
      {
        subject: {
          name: 'subjectName',
          id: 'subjectId',
          icon: {
            id: 'iconId',
          },
          image: {
            id: 'imageId',
          },
        },
        program: 'program',
        color: '#color',
      },
    ];

    const ctx = generateCtx({
      actions,
      models: {
        Assignables: newModel(mongooseConnection, 'Assignables', assignablesSchema),
        Assignations: newModel(mongooseConnection, 'Assignations', assignationsSchema),
        Classes: newModel(mongooseConnection, 'Classes', classesSchema),
        Dates: newModel(mongooseConnection, 'Dates', datesSchema),
        Grades: newModel(mongooseConnection, 'Grades', gradesSchema),
        Instances: newModel(mongooseConnection, 'Instances', instancesSchema),
        Roles: newModel(mongooseConnection, 'Roles', rolesSchema),
      },
    });

    // Act
    await createSubjectsRooms({
      assignableInstanceId,
      instance,
      parentKey,
      classes,
      teachers,
      ctx,
    });

    // Assert
    if (roomExists) {
      expect(actions['comunica.room.addUserAgents']).toHaveBeenCalled();
    } else {
      expect(actions['comunica.room.add']).toHaveBeenCalled();
    }
  });
});
