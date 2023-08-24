const { it, expect, beforeAll, afterAll, beforeEach } = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('leemons-testing');
const { newModel } = require('leemons-mongodb');
const { LeemonsError } = require('leemons-error');

const { addTagsToValues } = require('./addTagsToValues');
const { tagsSchema } = require('../../models/tags');

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

it('Should create and return all tags associated to all values with expected properties', async () => {
  // Arrange
  const tags = ['test-tag', 'confirmation-tag'];
  const type = 'leemons-test.my-type';
  const values = ['value1', 'value2'];

  const ctx = generateCtx({
    caller: 'leemons-test',
    models: {
      Tags: newModel(mongooseConnection, 'Tags', tagsSchema),
    },
  });

  const expectedValue = [
    { tag: 'test-tag', value: '"value1"', type: 'leemons-test.my-type' },
    { tag: 'test-tag', value: '"value2"', type: 'leemons-test.my-type' },
    { tag: 'confirmation-tag', value: '"value1"', type: 'leemons-test.my-type' },
    { tag: 'confirmation-tag', value: '"value2"', type: 'leemons-test.my-type' },
  ];

  // Act
  const response = await addTagsToValues({ type, tags, values, ctx });

  // Assert
  // Tags and values were associated correctly
  expect(
    response.map((createdTag) => ({
      tag: createdTag.tag,
      value: createdTag.value,
      type: createdTag.type,
    }))
  ).toEqual(expectedValue);
  // Each tag should contain the necesary related fields
  response.forEach((tag) => {
    expect(tag).toHaveProperty('id');
    expect(tag).toHaveProperty('deploymentID');
    expect(tag).toHaveProperty('createdAt');
    expect(tag).toHaveProperty('updatedAt');
    expect(tag).toHaveProperty('deletedAt');
    expect(tag).toHaveProperty('isDeleted');
  });
});

it('Should throw if the required tags or values are empty or of a different type', () => {
  // Arrange
  const tags = ['test-tag', 'confirmation-tag'];
  const type = 'leemons-test.my-type';
  const values = ['value1', 'value2'];

  const ctx = generateCtx({
    caller: 'leemons-test',
    models: {
      Tags: newModel(mongooseConnection, 'Tags', tagsSchema),
    },
  });

  // Act
  const testFnWithoutTags = () => addTagsToValues({ type, tags: [], values, ctx });
  const testFnWithoutValues = () => addTagsToValues({ type, tags, values: '', ctx });
  const testFnWrongValues = () => addTagsToValues({ type, tags, values: {}, ctx });

  // Assert
  expect(testFnWithoutTags).rejects.toThrowError(
    new LeemonsError(ctx, { message: 'Tags cannot be empty.' })
  );
  expect(testFnWithoutValues).rejects.toThrowError(
    new LeemonsError(ctx, { message: 'Values cannot be empty.' })
  );
  expect(testFnWrongValues).rejects.toThrowError(LeemonsError);
});

it('Should throw if the required params are not provided', async () => {
  // Arrange
  const tags = ['test-tag', 'confirmation-tag'];
  const type = 'leemons-test.my-type';
  const values = ['value1', 'value2'];

  const ctx = generateCtx({
    caller: 'leemons-test',
    models: {
      Tags: newModel(mongooseConnection, 'Tags', tagsSchema),
    },
  });

  // Act
  const testFnWithoutTags = () => addTagsToValues({ type, tags: undefined, values, ctx });
  const testFnWithValuesObj = () => addTagsToValues({ type, tags, values: undefined, ctx });
  const testFnWithoutType = () => addTagsToValues({ type: undefined, tags, values, ctx });

  // Assert
  await expect(testFnWithoutTags).rejects.toThrow('Tags cannot be empty.');
  await expect(testFnWithValuesObj).rejects.toThrow('Values cannot be empty.');
  // We're only checking if an error is thrown when `type` is missing,
  // as it's not the job of this function to dictate the specific error message.
  await expect(testFnWithoutType).rejects.toThrow(/^.*$/);
});
