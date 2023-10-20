const { it, expect } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { getAllTeachers } = require('./getAllTeachers');
const { classesModel } = require('../../../models/classes');
const { assignablesModel } = require('../../../models/assignables');

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

it('Should return all teachers for given classes', async () => {
  // Arrange
  const classes = [
    {
      subject: {
        id: 'subject1',
      },
    },
    {
      subject: {
        id: 'subject2',
      },
    },
  ];
  const classesData = [
    {
      subject: {
        id: 'subject1',
      },
      teachers: [
        {
          type: 'main-teacher',
          teacher: 'teacher1',
        },
      ],
    },
    {
      subject: {
        id: 'subject2',
      },
      teachers: [
        {
          type: 'main-teacher',
          teacher: {
            id: 'teacher2',
          },
        },
        {
          type: 'non-teacher',
          teacher: {
            id: 'teacher2',
          },
        },
      ],
    },
  ];

  // Act
  const teachers = getAllTeachers({ classes, classesData });

  // Assert
  expect(teachers).toEqual(['teacher1', 'teacher2']);
});
