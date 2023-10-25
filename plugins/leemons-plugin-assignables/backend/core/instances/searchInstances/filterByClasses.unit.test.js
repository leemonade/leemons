const {
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { filterByClasses } = require('./filterByClasses');
const { classesSchema } = require('../../../models/classes');

const classes = [
  {
    class: 'class1',
    assignableInstance: 'assignableId1',
  },
  {
    class: 'class2',
    assignableInstance: 'assignableId2',
  },
];

const classesByIdsHandler = jest.fn();

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
    actions: {
      'academic-portfolio.classes.classByIds': classesByIdsHandler,
    },
    models: {
      Classes: newModel(mongooseConnection, 'Classes', classesSchema),
    },
  });
});

it('Should return same assignables Instances Ids if no classes, subjects or programs in query', async () => {
  // Arrange
  const query = {};
  const assignableInstancesIds = ['assignableId1', 'assignableId2'];

  // Act
  const response = await filterByClasses({
    query,
    assignableInstancesIds,
    ctx,
  });

  // Assert
  expect(classesByIdsHandler).not.toBeCalled();
  expect(response).toEqual(assignableInstancesIds);
});

it('Should return assignable Instances Ids filtered by classes', async () => {
  // Arrange
  const query = { classes: ['class1'] };
  const assignableInstancesIds = ['assignableId1', 'assignableId2'];

  await ctx.tx.db.Classes.create(classes);

  // Act
  const response = await filterByClasses({
    query,
    assignableInstancesIds,
    ctx,
  });

  // Assert
  expect(classesByIdsHandler).not.toBeCalled();
  expect(response).toEqual(['assignableId1']);
});

it('Should return assignable Instances Ids filtered by subjects and programs', async () => {
  // Arrange
  const query = { subjects: ['subjectId2'], programs: ['programId2'] };
  const assignableInstancesIds = ['assignableId1', 'assignableId2'];

  await ctx.tx.db.Classes.create(classes);

  classesByIdsHandler.mockReturnValue([
    { id: 'class1', subject: { id: 'subjectId1' }, program: 'programId1' },
    { id: 'class2', subject: { id: 'subjectId2' }, program: 'programId2' },
  ]);

  // Act
  const response = await filterByClasses({
    query,
    assignableInstancesIds,
    ctx,
  });

  // Assert
  expect(response).toEqual(['assignableId2']);
});
