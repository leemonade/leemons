const { it, expect } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('leemons-testing');
const { newModel } = require('leemons-mongodb');
const { createAssignation } = require('./createAssignation');
const { getServiceModels } = require('../../../models');

jest.mock('../../instances/getInstance', () => ({
  getInstance: () => ({
    class: [],
    sendMail: true,
    assignable: {
      role: 'tests',
    },
  }),
}));
jest.mock('./getAllTeachers');
jest.mock('./createInstanceRoom', () => ({
  createInstanceRoom: () => ({
    key: 'key1',
  }),
}));
jest.mock('./createGroupRoom');
jest.mock('./createSubjectsRooms');
jest.mock('./checkIfStudentIsOnInstance');
jest.mock('./addUserSubjectRoom');
jest.mock('../../instances/sendEmail');
jest.mock('../../dates');
jest.mock('../../grades');

const { checkIfStudentIsOnInstance } = require('./checkIfStudentIsOnInstance');
const { createSubjectsRooms } = require('./createSubjectsRooms');

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

it('Should create an assignation', async () => {
  // Arrange
  const assignableInstanceId = 'assignable-instance-id';
  const users = ['user-id'];
  const options = {
    indexable: true,
    timestamps: {
      start: new Date()
    },
    grades: [{}]

  };
  const ctx = generateCtx({
    actions: {
      'users.users.getUserAgentsInfo': () => [],
      'academic-portfolio.classes.classByIds': () => [
        {
          id: 'class1',
          subject: {
            id: 'subject1',
          },
          teachers: [
            {
              type: 'main-teacher',
              teacher: 'teacher1',
            },
            {
              type: 'main-teacher',
              teacher: {
                id: 'teacher2'
              },
            },
          ],
        },
      ],
      'users.platform.getHostname': () => 'hostname',
      'users.platform.getHostnameApi': () => 'hostnameApi',
    },
    models: {
      Assignations: newModel(
        mongooseConnection,
        'Assignations',
        getServiceModels().Assignations.schema
      ),
    },
  });

  createSubjectsRooms.mockImplementation(async () => ({
    subject1: {
      key: 'key1',
    },
  }));
  checkIfStudentIsOnInstance.mockImplementation(async () => {
    return false;
  });

  // Act
  const result = await createAssignation({ assignableInstanceId, users, options, ctx });

  // Assert
  expect(result).toBeDefined();
});

it('Should throw an error if student is already assigned to instance', async () => {
  // Arrange
  const assignableInstanceId = 'assignable-instance-id';
  const users = ['user-id'];
  const options = {
    indexable: true,
  };
  const ctx = generateCtx({
    actions: {
      'users.users.getUserAgentsInfo': () => [],
      'academic-portfolio.classes.classByIds': () => [],
      'users.platform.getHostname': () => 'hostname',
      'users.platform.getHostnameApi': () => 'hostnameApi',
    },
    models: {
      Assignations: newModel(
        mongooseConnection,
        'Assignations',
        getServiceModels().Assignations.schema
      ),
    },
  });
  await ctx.tx.db.Assignations.create({
    user: users[0],
    instance: assignableInstanceId,
    classes: [],
    indexable: true,
  });

  checkIfStudentIsOnInstance.mockImplementation(async () => {
    console.log('entra2');
    return true;
  });

  // Act and Assert
  await expect(createAssignation({ assignableInstanceId, users, options, ctx })).rejects.toThrow();
});
