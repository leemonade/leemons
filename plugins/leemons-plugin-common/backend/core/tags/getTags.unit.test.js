const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('leemons-testing');
const { newModel } = require('leemons-mongodb');
const { LeemonsError } = require('leemons-error');
const _ = require('lodash');

const { getTags } = require('./getTags');
const { tagsSchema } = require('../../models/tags');
const tagsFixtures = require('../../__fixtures__/tagsFixtures');

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

it('Should return an array of tags filtering by type when passed', async () => {
  // Arrange
  const { tagsObjectFiltered } = tagsFixtures();
  const extraTag = { tag: 'extra', value: 'extra', type: 'extra' };

  const ctx = generateCtx({
    models: {
      Tags: newModel(mongooseConnection, 'Tags', tagsSchema),
    },
  });

  const initialValues = _.cloneDeep(tagsObjectFiltered);
  await ctx.db.Tags.create(initialValues);
  await ctx.db.Tags.create(extraTag);

  const expectedValues = {
    getsByType: [extraTag.tag],
    getsAllTagsIfNoTypeIsPassed: [extraTag.tag]
      .concat(initialValues.map((tag) => tag.tag))
      .sort((a, b) => a.localeCompare(b)),
    noTagsFound: [],
  };

  // Act
  const getsByTypeArray = await getTags({ type: [extraTag.type], ctx });
  const getsByTypeString = await getTags({ type: extraTag.type, ctx });
  const getsAllTagsIfNoTypeIsPassed = await getTags({ ctx }).then((res) =>
    res.sort((a, b) => a.localeCompare(b))
  );

  // Assert
  expect(getsByTypeArray).toEqual(expectedValues.getsByType);
  expect(getsByTypeString).toEqual(expectedValues.getsByType);
  expect(getsAllTagsIfNoTypeIsPassed).toEqual(expectedValues.getsAllTagsIfNoTypeIsPassed);
});

it('Should handle wrong or unexpected arguments', async () => {
  // Arrange
  const { tagsObjectFiltered } = tagsFixtures();

  const ctx = generateCtx({
    models: {
      Tags: newModel(mongooseConnection, 'Tags', tagsSchema),
    },
  });

  const initialValues = _.cloneDeep(tagsObjectFiltered);
  await ctx.db.Tags.create(initialValues);
  const expectedValue = initialValues.map((tag) => tag.tag).sort((a, b) => a.localeCompare(b));

  // Act
  const testFnWithWrongType = async () => getTags({ type: {}, ctx });
  const testFnWithUnexpectedType = async () => getTags({ type: [undefined], ctx });
  const testFnWithEmptyTypeArray = async () => getTags({ type: [], ctx });
  const emptyTypeString = await getTags({ type: '', ctx }).then((response) =>
    response.sort((a, b) => a.localeCompare(b))
  );

  // Assert
  await expect(testFnWithWrongType).rejects.toThrow(LeemonsError);
  await expect(testFnWithUnexpectedType).rejects.toThrow(LeemonsError);
  await expect(testFnWithEmptyTypeArray).rejects.toThrow(LeemonsError);
  expect(emptyTypeString).toEqual(expectedValue);
});

