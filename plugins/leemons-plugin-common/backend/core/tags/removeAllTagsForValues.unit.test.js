const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('leemons-testing');
const { newModel } = require('leemons-mongodb');
const { LeemonsError } = require('leemons-error');

const { removeAllTagsForValues } = require('./removeAllTagsForValues');
const { tagsSchema } = require('../../models/tags');
const tagsFixtures = require('../../__fixtures__/tagsFixtures');

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
    caller: 'leemons-test',
    models: {
      Tags: newModel(mongooseConnection, 'Tags', tagsSchema),
    },
  });
});

it('Should remove all tags for values correctly', async () => {
  // Arrange
  const { type, values } = tagsFixtures().initialData;
  const valuesToDelete = values[1];

  const initialTags = tagsFixtures().tagsObjectFiltered;
  await Promise.all(
    initialTags.map(async (tag) =>
      ctx.tx.db.Tags.create(tag).then((mongooseDoc) => mongooseDoc.toObject())
    )
  );
  const expectedValues = {
    deletedCount: 2,
    dbFinalState: tagsFixtures()
      .tagsObjectFiltered.filter((objTag) => objTag.value !== JSON.stringify(valuesToDelete))
      .sort((a, b) => a.tag.localeCompare(b.tag)),
  };

  // Act
  const response = await removeAllTagsForValues({
    type,
    values: valuesToDelete,
    ctx,
  });
  const dbFinalState = await ctx.tx.db.Tags.find({})
    .lean()
    .then((result) =>
      result
        .map((remainingTag) => ({
          tag: remainingTag.tag,
          value: remainingTag.value,
          type: remainingTag.type,
        }))
        .sort((a, b) => a.tag.localeCompare(b.tag))
    );

  // Assert
  expect(response.deletedCount).toEqual(expectedValues.deletedCount);
  expect(dbFinalState).toEqual(expectedValues.dbFinalState);
});

it('Should throw when wrong values are passed', async () => {
  // Arrange
  const { type } = tagsFixtures().initialData;

  // Act
  const testFnWithEmptyArray = async () =>
    removeAllTagsForValues({
      type,
      values: [],
      ctx,
    });
  const testFnWithEmptyString = async () =>
    removeAllTagsForValues({
      type,
      values: '',
      ctx,
    });
  const testFnWithWrongType = async () =>
    removeAllTagsForValues({
      type,
      values: {},
      ctx,
    });

  // Assert
  await expect(testFnWithEmptyArray).rejects.toThrowError(LeemonsError);
  await expect(testFnWithEmptyString).rejects.toThrowError(LeemonsError);
  await expect(testFnWithWrongType).rejects.toThrowError(LeemonsError);
});

it('Should throw when required parameters are missing', async () => {
  // Arrange
  const { type, values } = tagsFixtures().initialData;

  // Act
  const testFnWithNoType = async () =>
    removeAllTagsForValues({
      type: undefined,
      values,
      ctx,
    });
  const testFnWithNoValues = async () =>
    removeAllTagsForValues({
      type,
      values: undefined,
      ctx,
    });
  const testFnWithNoCtx = async () =>
    removeAllTagsForValues({
      type,
      values,
    });

  // Assert
  await expect(testFnWithNoType).rejects.toThrowError(LeemonsError);
  await expect(testFnWithNoValues).rejects.toThrowError(LeemonsError);
  await expect(testFnWithNoCtx).rejects.toThrow();
});
