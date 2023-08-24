const { LeemonsError } = require('leemons-error');
const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('leemons-testing');
const { newModel } = require('leemons-mongodb');

const { removeAllTagsForValues } = require('./removeAllTagsForValues');
const { tagsSchema } = require('../../models/tags');

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
  const type = 'leemons-test.my-type';
  const valuesToDelete = ['value2'];

  const initialTags = [
    { tag: 'test-tag', value: '"value1"', type: 'leemons-test.my-type' },
    { tag: 'test-tag', value: '"value2"', type: 'leemons-test.my-type' },
    { tag: 'confirmation-tag', value: '"value2"', type: 'leemons-test.my-type' },
  ];
  await Promise.all(
    initialTags.map(async (tag) =>
      ctx.tx.db.Tags.create(tag).then((mongooseDoc) => mongooseDoc.toObject())
    )
  );
  const expectedValues = {
    deletedCount: 2,
    dbFinalState: [{ tag: 'test-tag', value: '"value1"', type: 'leemons-test.my-type' }],
  };

  // Act
  const response = await removeAllTagsForValues({
    type,
    values: valuesToDelete,
    ctx,
  });
  const dbFinalState = await ctx.tx.db.Tags.find({}).lean();

  // Assert
  expect(response.deletedCount).toEqual(expectedValues.deletedCount);
  expect(
    dbFinalState.map((remainingTag) => ({
      tag: remainingTag.tag,
      value: remainingTag.value,
      type: remainingTag.type,
    }))
  ).toEqual(expectedValues.dbFinalState);
});

it('Should throw when wrong values are passed', async () => {
  // Arrange
  const type = 'leemons-test.my-type';
  const emptyValues = [];
  const wrongValues = {};

  // Act

  const testFnWithEmptyValues = async () =>
    removeAllTagsForValues({
      type,
      values: emptyValues,
      ctx,
    });
  const testFnWithWrongValues = async () =>
    removeAllTagsForValues({
      type,
      values: wrongValues,
      ctx,
    });

  // Assert
  await expect(testFnWithEmptyValues).rejects.toThrowError(LeemonsError);
  await expect(testFnWithWrongValues).rejects.toThrowError(LeemonsError);
});

it('Should throw when required parameters are missing', async () => {
  // Arrange
  const type = 'leemons-test.my-type';
  const values = ['value1'];

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
