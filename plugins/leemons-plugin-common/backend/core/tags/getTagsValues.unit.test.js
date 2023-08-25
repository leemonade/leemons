const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('leemons-testing');
const { newModel } = require('leemons-mongodb');
const { LeemonsError } = require('leemons-error');
const _ = require('lodash');

const { getTagsValues } = require('./getTagsValues');
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

it('Should query the DB filtering by type and return an array with arrays of values found for each tag passed', async () => {
  // Arrange
  const { tagsObjectFiltered, initialData } = tagsFixtures();
  const { tags, type } = initialData;
  const tagsToFind = [tags[0]];

  const ctx = generateCtx({
    models: {
      Tags: newModel(mongooseConnection, 'Tags', tagsSchema),
    },
  });

  const initialValues = _.cloneDeep(tagsObjectFiltered);
  await ctx.db.Tags.create(initialValues);
  await ctx.db.Tags.create({ tag: tags[0], value: '"extra-value"', type: 'extra-type' });

  const expectedValue = [
    tagsObjectFiltered
      .filter((tag) => tagsToFind.includes(tag.tag))
      .map((tag) => JSON.parse(tag.value)),
  ];
  const notFilteringByTypeExpectedValue = [[...expectedValue[0], 'extra-value']];

  // Act
  const response = await getTagsValues({ tags: tagsToFind, type, ctx });
  const responseForMissingTags = await getTagsValues({
    tags: [...tagsToFind, 'non-existent-tag'],
    type,
    ctx,
  });
  const notFilteringByTypeResponse = await getTagsValues({ tags: tagsToFind, ctx });

  // Assert
  expect(response).toEqual(expectedValue);
  expect(responseForMissingTags).toEqual([...expectedValue, []]);
  expect(notFilteringByTypeResponse).toEqual(notFilteringByTypeExpectedValue);
});

it('Should handle wrong or unexpected arguments', async () => {
  // Arrange
  const { initialData, tagsObjectFiltered } = tagsFixtures();
  const { tags, type } = initialData;

  const wrongTags = {};
  const unexpectedTags = [88];
  const wrongType = {};
  const emptyArrayType = [];
  const unexpectedType = [undefined];

  const ctx = generateCtx({
    models: {
      Tags: newModel(mongooseConnection, 'Tags', tagsSchema),
    },
  });
  const initialValues = _.cloneDeep(tagsObjectFiltered);
  await ctx.db.Tags.create(initialValues);

  // Act
  const testFnWithWrongTypeOfTags = async () => getTagsValues({ tags: wrongTags, type, ctx });
  const testFnWithUnexpectedTags = async () => getTagsValues({ tags: unexpectedTags, type, ctx });
  const testFnWithWrongTypeOfType = async () => getTagsValues({ tags, type: wrongType, ctx });
  const testFnWithEmptyArrayType = async () => getTagsValues({ tags, type: emptyArrayType, ctx });
  const testFnWithUnexpectedType = async () => getTagsValues({ tags, type: unexpectedType, ctx });

  // Assert
  await expect(testFnWithWrongTypeOfTags).rejects.toThrow(
    new LeemonsError(ctx, { message: 'Tags must be a not empty string or array of strings.' })
  );
  await expect(testFnWithUnexpectedTags).rejects.toThrow(
    new LeemonsError(ctx, { message: 'Tags must be a not empty string or array of strings.' })
  );
  await expect(testFnWithWrongTypeOfType).rejects.toThrow(LeemonsError);
  await expect(testFnWithEmptyArrayType).rejects.toThrow(LeemonsError);
  await expect(testFnWithUnexpectedType).rejects.toThrow(LeemonsError);
});

it('Should throw if required parameters are not passed', async () => {
  // Arrange
  const ctx = generateCtx({
    models: {
      Tags: newModel(mongooseConnection, 'Tags', tagsSchema),
    },
  });

  // Act
  const testFnWithNoTags = async () => getTagsValues({ ctx });

  // Assert
  await expect(testFnWithNoTags).rejects.toThrow(
    new LeemonsError(ctx, { message: 'Tags must be a not empty string or array of strings.' })
  );
});
