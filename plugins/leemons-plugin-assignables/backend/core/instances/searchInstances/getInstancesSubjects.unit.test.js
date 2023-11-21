const {
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { getInstancesSubjects } = require('./getInstancesSubjects');
const { classesSchema } = require('../../../models/classes');
const { getClassesObject } = require('../../../__fixtures__/getClassesObject');

const classesByIdsHandler = jest.fn();

const klass = getClassesObject();

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

it('Should call getInstancesSubjects correctly', async () => {
  // Arrange
  const instances = ['instanceId1'];
  const expectedValue = { instanceId1: ['subjectId1'] };

  const ctx = generateCtx({
    actions: {
      'academic-portfolio.classes.classByIds': classesByIdsHandler,
    },
    models: {
      Classes: newModel(mongooseConnection, 'Classes', classesSchema),
    },
  });

  classesByIdsHandler.mockReturnValue([
    {
      id: 'clase1',
      subject: {
        id: 'subjectId1',
      },
    },
  ]);

  await ctx.tx.db.Classes.create(klass);

  // Act
  const response = await getInstancesSubjects({ instances, ctx });

  // Assert
  expect(classesByIdsHandler).toBeCalledWith({ ids: [klass.class] });
  expect(response).toEqual(expectedValue);
});
