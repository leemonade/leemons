const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { getAssignablesData } = require('./getAssignablesData');
const { assignablesSchema } = require('../../../../models/assignables');
const { getAssignableObject } = require('../../../../__fixtures__/getAssignableObject');

// MOCK
jest.mock('./getAssetsData');
const { getAssetsData } = require('./getAssetsData');

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

const mockAssignableObj = getAssignableObject();

it('Should correctly get assignable data without duplications', async () => {
  // Arrange
  const assignables = ['assignableOneId', 'assignableTwoId', 'assignableOneId'];

  const ctx = generateCtx({
    models: {
      Assignables: newModel(mongooseConnection, 'Assignables', assignablesSchema),
    },
  });

  const initialValues = [
    { ...mockAssignableObj, id: assignables[0], asset: 'assetOneId' },
    { ...mockAssignableObj, id: assignables[1], asset: 'assetTwoId' },
  ];
  await ctx.db.Assignables.create(initialValues);

  const mockAssetsData = {
    [initialValues[0].asset]: { id: 'assetOneId', name: 'Asset One' },
    [initialValues[1].asset]: { id: 'assetTwoId', name: 'Asset Two' },
  };
  getAssetsData.mockResolvedValue(mockAssetsData);

  const expectedResult = {
    [assignables[0]]: {
      id: assignables[0],
      role: initialValues[0].role,
      asset: mockAssetsData[initialValues[0].asset],
    },
    [assignables[1]]: {
      id: assignables[1],
      role: initialValues[1].role,
      asset: mockAssetsData[initialValues[1].asset],
    },
  };
  // Act
  const response = await getAssignablesData({ assignables, ctx });

  // Assert
  expect(getAssetsData).toBeCalledWith({
    assets: initialValues.map((item) => item.asset),
    ctx,
  });
  expect(response).toMatchObject(expectedResult);
});
