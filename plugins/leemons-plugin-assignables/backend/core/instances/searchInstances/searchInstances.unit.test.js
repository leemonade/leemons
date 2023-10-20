// TODO UNFINISHED TEST (skipped)

const {
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { searchInstances } = require('./searchInstances');
const { instancesSchema } = require('../../../models/instances');
const {
  getInstanceObject,
} = require('../../../__fixtures__/getInstanceObject');

const { getActivitiesByProfile } = require('./getActivitiesByProfile');
const { filterByInstanceDates } = require('./filterByInstanceDates');
const { filterByClasses } = require('./filterByClasses');
const { filterByGraded } = require('./filterByGraded');
const { searchByAsset } = require('./searchByAsset');
const { getAssignables } = require('./getAssignables');

jest.mock('./getActivitiesByProfile');
jest.mock('./filterByInstanceDates');
jest.mock('./filterByClasses');
jest.mock('./filterByGraded');
jest.mock('./searchByAsset');
jest.mock('./getAssignables');

const instance = getInstanceObject();

const instances = [
  {
    ...instance,
    id: 'instanceId1',
    relatedAssignableInstances: { after: ['instanceId3'] },
  },
  { ...instance, id: 'instanceId2' },
];

let mongooseConnection;
let disconnectMongoose;
let ctx;

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

  ctx = generateCtx({
    models: {
      Instances: newModel(mongooseConnection, 'Instances', instancesSchema),
    },
  });

  await ctx.tx.db.Instances.create(instances);
});

describe('searchInstances if role is teacher', () => {
  it('Should return empty array if no instances found', async () => {
    // Arrange
    const expectedResponse = [];
    const query = {};

    getActivitiesByProfile.mockReturnValue({
      isTeacher: true,
      assignableInstances: [],
    });

    // Act
    const response = await searchInstances({ query, ctx });

    // Assert
    expect(response).toEqual(expectedResponse);
  });

  it.skip('Should return instances if has assignations', async () => {
    // Arrange
    const expectedResponse = '';
    const query = {};

    getActivitiesByProfile.mockReturnValue({
      isTeacher: true,
      assignableInstances: ['instanceId1', 'instanceId2', 'instanceId3'],
    });
    filterByInstanceDates.mockReturnValue([
      'instanceId1',
      'instanceId2',
      'instanceId3',
    ]);
    filterByClasses.mockReturnValue([
      'instanceId1',
      'instanceId2',
      'instanceId3',
    ]);
    getAssignables.mockReturnValue([
      {
        asset: 'assetId1',
        assignable: 'assignableId1',
        id: 'instanceId1',
        role: 'teacher',
      },
      {
        asset: 'assetId2',
        assignable: 'assignableId2',
        id: 'instanceId1',
        role: 'teacher',
      },
    ]);
    searchByAsset.mockReturnValue(['assetId1', 'assetId2']);
    filterByGraded.mockReturnValue(['instanceId1', 'instanceId2']);

    // Act
    const response = await searchInstances({ query, ctx });

    // Assert
    expect(getActivitiesByProfile).toBeCalledWith({ ctx });
    expect(filterByInstanceDates).toBeCalledWith({
      query,
      assignableInstancesIds: ['instanceId1'],
      ctx,
    });
    expect(filterByClasses).toBeCalledWith({
      query,
      assignableInstancesIds: ['instanceId1'],
      ctx,
    });
    expect(getAssignables).toBeCalledWith({
      assignableInstancesIds: ['instanceId1'],
      ctx,
    });
    expect(searchByAsset).toBeCalledWith({
      assignableInstancesIds: ['instanceId1'],
      query,
      ctx,
    });
    expect(filterByGraded).toBeCalledWith({
      objects: ['instanceId1'],
      query,
      isTeacher: true,
      ctx,
    });

    expect(response).toEqual(expectedResponse);
  });
});
