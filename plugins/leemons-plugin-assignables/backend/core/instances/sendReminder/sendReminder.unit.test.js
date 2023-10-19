const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { sendReminder } = require('./sendReminder');
const { getInstanceObject } = require('../../../__fixtures__/getInstanceObject');

const { datesSchema } = require('../../../models/dates');

const { sendEmail } = require('../sendEmail');
const { getInstance } = require('../getInstance');

jest.mock('../sendEmail');
jest.mock('../getInstance');

const getHostnameHandler = jest.fn();
const getHostnameApiHandler = jest.fn();
const classByIdsHandler = jest.fn();
const getUserAgentsInfoHandler = jest.fn();

let mongooseConnection;
let disconnectMongoose;
let ctx;
let instance;

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
      Dates: newModel(mongooseConnection, 'Dates', datesSchema),
    },
    actions: {
      'users.platform.getHostname': getHostnameHandler,
      'user.platform.getHostnameApi': getHostnameApiHandler,
      'academic-portfolio.classes.classByIds': classByIdsHandler,
      'users.users.getUserAgentsInfo': getUserAgentsInfoHandler,
    },
  });

  instance = {
    ...getInstanceObject(),
    id: 'instanceId1',
    students: [{ id: 'assignationId1', user: 'userId1' }],
    classes: ['classId1', 'classId2'],
  };
});

const testCases = [
  {
    users: ['userId1', 'userId2'],
    type: 'deadline',
  },
  {
    users: [],
    type: undefined,
  },
];

testCases.forEach(({ users, type }) => {
  it('Should send reminder to users', async () => {
    // Arrange
    // Create test data for dates from the model @dates.js
    const dates = [
      {
        id: 'dateId1',
        type: 'assignation',
        instance: 'assignationId2',
        name: 'deadline',
        date: new Date(),
      },
    ];
    await ctx.tx.db.Dates.create(dates);

    getInstance.mockResolvedValue(instance);
    getHostnameHandler.mockResolvedValue('example.com');
    getHostnameApiHandler.mockResolvedValue('api.example.com');
    const classes = [
      {
        id: 'classId1',
        subject: {
          id: 'subjectId1',
        },
      },
      {
        id: 'classId2',
        subject: {
          id: 'subjectId1',
        },
      },
    ];
    classByIdsHandler.mockResolvedValue(classes);
    const userAgents = ['userAgentId1', 'userAgentId2'];
    getUserAgentsInfoHandler.mockResolvedValue(userAgents);

    // Act
    await sendReminder({
      assignableInstanceId: 'assignationId1',
      users,
      type,
      ctx,
    });

    // Assert
    expect(getInstance).toBeCalledWith({
      id: 'assignationId1',
      details: true,
      ctx,
    });
    expect(getHostnameHandler).toBeCalledWith(undefined);
    expect(getHostnameApiHandler).toBeCalledWith(undefined);
    expect(classByIdsHandler).toBeCalledWith({
      ids: ['classId1', 'classId2'],
      withTeachers: true,
    });
    expect(getUserAgentsInfoHandler).toBeCalledWith({
      userAgentIds: ['userId1'],
      withCenter: true,
      userColumns: ['id', 'email', 'locale'],
    });

    expect(sendEmail).toBeCalledTimes(2);
    expect(sendEmail).toBeCalledWith({
      instance,
      userAgent: expect.stringContaining('userAgentId'),
      classes: [classes[0]],
      hostname: 'example.com',
      hostnameApi: 'api.example.com',
      ignoreUserConfig: true,
      isReminder: true,
      ctx,
    });
    expect(getInstance).toHaveBeenCalledWith({
      id: 'assignationId1',
      details: true,
      ctx,
    });
  });
});
