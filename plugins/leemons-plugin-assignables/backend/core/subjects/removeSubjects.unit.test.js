const {
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { map } = require('lodash');
const { removeSubjects } = require('./removeSubjects');
const { subjectsSchema } = require('../../models/subjects');

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

it('Should remove the subjects', async () => {
  // Arrange
  const ctx = generateCtx({
    models: {
      Subjects: newModel(mongooseConnection, 'Subjects', subjectsSchema),
    },
  });

  const initialValues = [
    {
      assignable: 'assignable-id',
      program: 'program-id',
      subject: 'subject-id-1',
      level: 'intermediate',
    },
    {
      assignable: 'assignable-id',
      program: 'program-id',
      subject: 'subject-id-2',
      level: 'intermediate',
    },
    {
      assignable: 'other-assignable-id',
      program: 'program-id',
      subject: 'subject-id',
      level: 'intermediate',
    },
  ];
  await ctx.db.Subjects.create(initialValues);
  const savedSubject = await ctx.db.Subjects.find({
    assignable: 'assignable-id',
  }).lean();
  const ids = map(savedSubject, 'id');

  // Act
  const response = await removeSubjects({ ids, ctx });
  const countOfRemovedIds = await ctx.db.Subjects.countDocuments({
    assignable: 'assignable-id',
  });
  const totalCount = await ctx.db.Subjects.countDocuments({});

  // Assert
  expect(response).toBe(2);
  expect(countOfRemovedIds).toBe(0);
  expect(totalCount).toBe(1);
});

it('Should throw if no valid ids are provided', async () => {
  // Arrange
  const ids = [1, 2, 3];
  const ctx = generateCtx({
    models: {
      Subjects: newModel(mongooseConnection, 'Subjects', subjectsSchema),
    },
  });

  // Act
  const noIdsFn = () => removeSubjects({ ids: undefined, ctx });
  const noStringIdsFn = () => removeSubjects({ ids, ctx });

  // Assert
  await expect(noIdsFn).rejects.toThrowError(
    'Cannot remove subjects: Ids must be strings'
  );
  await expect(noStringIdsFn).rejects.toThrowError(
    'Cannot remove subjects: Ids must be strings'
  );
});
