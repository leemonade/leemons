const { it, expect } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');
const { getAssignations } = require('./getAssignations');
const { getServiceModels } = require('../../../models');

jest.mock('./checkPermissions');
jest.mock('./getClassesWithSubject');
jest.mock('./getRelatedAssignationsTimestamps');
jest.mock('./findAssignationDates');
jest.mock('./findInstanceDates');
jest.mock('./getGrades');
jest.mock('./getAssignationStatus');
jest.mock('./../../instances/getInstances');

const { checkPermissions } = require('./checkPermissions');
const { getClassesWithSubject } = require('./getClassesWithSubject');
const { getRelatedAssignationsTimestamps } = require('./getRelatedAssignationsTimestamps');
const { findAssignationDates } = require('./findAssignationDates');
const { findInstanceDates } = require('./findInstanceDates');
const { getGrades } = require('./getGrades');
const { getAssignationStatus } = require('./getAssignationStatus');
const { getInstances } = require('../../instances/getInstances');

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

it('Should get assignations', async () => {
  // Arrange
  const assignationsIds = [
    { instance: 'instance-id', user: 'user-id', id: 'assignation-id' },
    { instance: 'instance-id', user: 'user-id' },
  ];
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

  checkPermissions.mockImplementation(async () => ({
    'assignation-id': true,
  }));
  getClassesWithSubject.mockImplementation(async () => ({
    'instance-id': {
      subjectsIds: ['subject-id'],
    },
  }));
  getRelatedAssignationsTimestamps.mockImplementation(async () => ({
    'assignation-id': [],
  }));
  findAssignationDates.mockImplementation(async () => ({
    'assignation-id': {},
  }));
  findInstanceDates.mockImplementation(async () => ({
    'instance-id': {},
  }));
  getGrades.mockImplementation(async () => [
    {
      id: 'grade-id',
      assignation: 'assignation-id',
      grade: 100,
    },
  ]);
  getAssignationStatus.mockImplementation(() => ({
    status: 'status',
    statusDate: 'status-date',
  }));
  getInstances.mockImplementation(async () => [
    {
      id: 'instance-id',
      name: 'instance-name',
      metadata: {},
      classes: {},
    },
  ]);

  // Inserting data into Assignations
  await ctx.tx.db.Assignations.create({
    id: 'assignation-id',
    instance: 'instance-id',
    user: 'user-id',
    classes: JSON.stringify({}),
    metadata: JSON.stringify({}),
    indexable: true,
    deploymentID: 'deployment-id',
  });

  // Act
  const result = await getAssignations({
    assignationsIds,
    throwOnMissing: false,
    fetchInstance: true,
    ctx,
  });

  // Assert
  expect(result).toBeDefined();
  expect(result[0].id).toEqual('assignation-id');
  expect(result[0].chatKeys).toEqual([
    'plugins.assignables.subject|subject-id.assignation|assignation-id.userAgent|user-id',
  ]);
});

it('Should error when not permissions', async () => {
  // Arrange
  const assignationsIds = [
    { instance: 'instance-id', user: 'user-id', id: 'assignation-id' },
    { instance: 'instance-id', user: 'user-id' },
  ];
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

  checkPermissions.mockImplementation(async () => ({
    'assignation-id': false,
  }));

  // Inserting data into Assignations
  await ctx.tx.db.Assignations.create({
    id: 'assignation-id',
    instance: 'instance-id',
    user: 'user-id',
    classes: JSON.stringify({}),
    metadata: JSON.stringify({}),
    indexable: true,
    deploymentID: 'deployment-id',
  });

  // Act
  // Assert
  await expect(
    getAssignations({ assignationsIds, throwOnMissing: true, ctx })
  ).rejects.toThrowError();
});
