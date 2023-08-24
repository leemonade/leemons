const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('leemons-testing');
const { newModel } = require('leemons-mongodb');
const { LeemonsError } = require('leemons-error');

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
  const { tagsObjectFiltered: initialTags } = tagsFixtures();
  const extraTag = { tag: 'extra', value: 'extra', type: 'extra' };

  const ctx = generateCtx({
    models: {
      Tags: newModel(mongooseConnection, 'Tags', tagsSchema),
    },
  });

  await ctx.db.Tags.create(initialTags);
  await ctx.db.Tags.create(extraTag);

  const expectedValues = {
    getsByType: [extraTag.tag],
    getsAllTagsIfNoTypeIsPassed: [extraTag.tag]
      .concat(initialTags.map((tag) => tag.tag))
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
  const { tagsObjectFiltered: initialTags } = tagsFixtures();

  const ctx = generateCtx({
    models: {
      Tags: newModel(mongooseConnection, 'Tags', tagsSchema),
    },
  });

  await ctx.db.Tags.create(initialTags);
  const expectedValue = initialTags.map((tag) => tag.tag).sort((a, b) => a.localeCompare(b));

  // Act
  const wrongType = async () => getTags({ type: {}, ctx });
  const crazyType = async () => getTags({ type: [undefined], ctx });
  const emptyTypeArray = await getTags({ type: [], ctx }).then((response) =>
    response.sort((a, b) => a.localeCompare(b))
  );
  const emptyTypeString = await getTags({ type: '', ctx }).then((response) =>
    response.sort((a, b) => a.localeCompare(b))
  );

  // Assert
  await expect(wrongType).rejects.toThrow(LeemonsError);
  await expect(crazyType).rejects.toThrow(LeemonsError);
  expect(emptyTypeArray).toEqual(expectedValue);
  expect(emptyTypeString).toEqual(expectedValue);
});

it('Should throw if no ctx is passed', async () => {
  // Act
  const wrongArgs = async () => getTags();

  // Assert
  expect(wrongArgs).rejects.toThrow();
});
