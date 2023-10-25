const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('@leemons/testing');
const { newModel } = require('@leemons/mongodb');

const { handleSubjectsUpdates } = require('./handleSubjectsUpdates');
const { assetsSubjectsSchema } = require('../../../models/assetsSubjects');

let mongooseConnection;
let disconnectMongoose;
let ctx;
let initialSubjects;
let assetId;
let subjects;

beforeAll(async () => {
  const { mongoose, disconnect } = await createMongooseConnection();

  mongooseConnection = mongoose;
  disconnectMongoose = disconnect;

  ctx = generateCtx({
    actions: {},
    models: {
      AssetsSubjects: newModel(mongooseConnection, 'ExampleModel', assetsSubjectsSchema),
    },
  });

  initialSubjects = [
    {
      asset: 'someAssetId',
      subject: 'subject1',
    },
    {
      asset: 'someAssetId',
      subject: 'subject2',
    },
  ];

  assetId = 'someAssetId';
  subjects = [
    {
      subject: 'subject3',
    },
    {
      subject: 'subject4',
    },
    {
      subject: 'subject5',
    },
  ];
});

afterAll(async () => {
  await disconnectMongoose();

  mongooseConnection = null;
  disconnectMongoose = null;
});

beforeEach(async () => {
  await mongooseConnection.dropDatabase();
});

it('Should handle subjects updates correctly', async () => {
  // Arrange

  await ctx.tx.db.AssetsSubjects.create(initialSubjects);
  const diff = ['subjects'];

  // Act
  await handleSubjectsUpdates({ assetId, subjects, diff, ctx });

  // Assert
  const oldSubjects = await ctx.tx.db.AssetsSubjects.find({
    subject: initialSubjects.map((el) => el.subject),
  }).lean();
  const newSubjects = await ctx.tx.db.AssetsSubjects.find({
    subject: subjects.map((el) => el.subject),
  });

  expect(oldSubjects.length).toBe(0);
  expect(newSubjects.length).toBe(subjects.length);
});
it('Should not update subjects if diff does not include "subjects"', async () => {
  // Arrange

  await ctx.tx.db.AssetsSubjects.create(initialSubjects);
  const diff = ['notSubjects'];

  // Act
  await handleSubjectsUpdates({ assetId, subjects, diff, ctx });

  // Assert
  const oldSubjects = await ctx.tx.db.AssetsSubjects.find({
    subject: initialSubjects.map((el) => el.subject),
  }).lean();
  const newSubjects = await ctx.tx.db.AssetsSubjects.find({
    subject: subjects.map((el) => el.subject),
  });

  expect(oldSubjects.length).toBe(initialSubjects.length);
  expect(newSubjects.length).toBe(0);
});

it('Should throw an error if subjects to add do not have the subject field', async () => {
  // Arrange
  const invalidSubjects = [
    {
      asset: 'someAssetId',
      // missing subject field
    },
  ];

  const diff = ['subjects'];

  // Act and Assert
  await expect(
    handleSubjectsUpdates({ assetId, subjects: invalidSubjects, diff, ctx })
  ).rejects.toThrow();
});
it('Should handle empty subjects array correctly', async () => {
  // Arrange
  const emptySubjects = [];
  const diff = ['subjects'];

  // Act
  await handleSubjectsUpdates({ assetId, subjects: emptySubjects, diff, ctx });

  // Assert
  const oldSubjects = await ctx.tx.db.AssetsSubjects.find({
    subject: initialSubjects.map((el) => el.subject),
  }).lean();
  const newSubjects = await ctx.tx.db.AssetsSubjects.find({
    subject: emptySubjects.map((el) => el.subject),
  });

  expect(oldSubjects.length).toBe(0);
  expect(newSubjects.length).toBe(0);
});
