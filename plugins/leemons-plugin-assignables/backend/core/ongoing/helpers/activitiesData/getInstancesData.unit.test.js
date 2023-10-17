const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('leemons-testing');
const { newModel } = require('leemons-mongodb');

const { getInstancesData } = require('./getInstancesData');
const { instancesSchema } = require('../../../../models/instances');
const { getInstanceObject } = require('../../../../__fixtures__/getInstanceObject');

// MOCKS
jest.mock('./getAssignablesData');
const { getAssignablesData } = require('./getAssignablesData');

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
  jest.resetAllMocks();
});

const mockInstanceObj = getInstanceObject();
mockInstanceObj.metadata = JSON.stringify(mockInstanceObj.metadata);
mockInstanceObj.relatedAssignableInstances = JSON.stringify(
  mockInstanceObj.relatedAssignableInstances
);

it('Should return instances data correctly', async () => {
  // Arrange
  const instances = ['assignableInstanceOneId', 'assignableInstanceTwoId'];

  const ctx = generateCtx({
    models: {
      Instances: newModel(mongooseConnection, 'Instances', instancesSchema),
    },
  });

  const initialValues = [
    {
      ...mockInstanceObj,
      id: instances[0],
      assignable: 'assignableOneId',
    },
    { ...mockInstanceObj, id: instances[1], assignable: 'assignableTwoId' },
  ];
  await ctx.db.Instances.create(initialValues);

  const mockAssignablesData = {
    [initialValues[0].assignable]: { asset: {}, id: initialValues[0].assignable, role: 'task' },
    [initialValues[1].assignable]: { asset: {}, id: initialValues[1].assignable, role: 'feedback' },
  };
  getAssignablesData.mockResolvedValue(mockAssignablesData);

  const expectedResult = {
    [instances[0]]: {
      id: instances[0],
      assignable: mockAssignablesData[initialValues[0].assignable],
      metadata: JSON.parse(initialValues[0].metadata),
      alwaysAvailable: true,
      requiresScoring: false,
      allowFeedback: false,
    },
    [instances[1]]: {
      id: instances[1],
      assignable: mockAssignablesData[initialValues[1].assignable],
      metadata: JSON.parse(initialValues[1].metadata),
      alwaysAvailable: true,
      requiresScoring: false,
      allowFeedback: false,
    },
  };
  // Act
  const response = await getInstancesData({ instances, ctx });

  // Assert
  expect(getAssignablesData).toBeCalledWith({
    assignables: initialValues.map((item) => item.assignable),
    ctx,
  });
  expect(response).toMatchObject(expectedResult);
});

it('Should return related instances data correctly', async () => {
  // Arrange
  const instances = ['assignableInstanceOneId', 'assignableInstanceTwoId'];

  const ctx = generateCtx({
    models: {
      Instances: newModel(mongooseConnection, 'Instances', instancesSchema),
    },
  });

  const initialValues = [
    {
      ...mockInstanceObj,
      id: instances[0],
      assignable: 'assignableOne',
    },
    { ...mockInstanceObj, id: instances[1], assignable: 'assignableTwo' },
  ];
  await ctx.db.Instances.create(initialValues);
  const mockAssignablesData = {
    [initialValues[0].assignable]: { asset: {}, id: initialValues[0].assignable, role: 'task' },
    [initialValues[1].assignable]: { asset: {}, id: initialValues[1].assignable, role: 'feedback' },
  };

  getAssignablesData.mockResolvedValue(mockAssignablesData);
  const expectedResult = {
    [instances[0]]: {
      id: instances[0],
      assignable: mockAssignablesData[initialValues[0].assignable],
      metadata: JSON.parse(initialValues[0].metadata),
      alwaysAvailable: true,
      requiresScoring: false,
      allowFeedback: false,
      relatedAssignableInstances: JSON.parse(initialValues[0].relatedAssignableInstances),
    },
    [instances[1]]: {
      id: instances[1],
      assignable: mockAssignablesData[initialValues[1].assignable],
      metadata: JSON.parse(initialValues[1].metadata),
      alwaysAvailable: true,
      requiresScoring: false,
      allowFeedback: false,
      relatedAssignableInstances: JSON.parse(initialValues[1].relatedAssignableInstances),
    },
  };
  // Act
  const response = await getInstancesData({ instances, relatedInstances: true, ctx });

  // Assert
  expect(getAssignablesData).toBeCalledWith({
    assignables: expect.arrayContaining(initialValues.map((item) => item.assignable)),
    ctx,
  });
  expect(response).toMatchObject(expectedResult);
});
