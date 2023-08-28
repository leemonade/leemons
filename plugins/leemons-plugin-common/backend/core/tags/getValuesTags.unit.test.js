const {
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  jest: { spyOn },
} = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('leemons-testing');
const { newModel } = require('leemons-mongodb');
const _ = require('lodash');
const { LeemonsError } = require('leemons-error');

const { getValuesTags } = require('./getValuesTags');
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

it('Should query the DB filtering by type and return an array with arrays of tags found for each value passed', async () => {
  // Arrange
  const { tagsObjectFiltered, initialData } = tagsFixtures();
  const { values, type } = initialData;
  const valuesToFind = [values[0]];

  const ctx = generateCtx({
    models: {
      Tags: newModel(mongooseConnection, 'Tags', tagsSchema),
    },
  });

  const initialValues = _.cloneDeep(tagsObjectFiltered);
  await ctx.db.Tags.create(initialValues);
  await ctx.db.Tags.create({
    tag: 'extra-tag',
    value: JSON.stringify(values[0]),
    type: 'extra-type',
  });

  const expectedValue = [
    tagsObjectFiltered
      .filter((tag) => valuesToFind.includes(JSON.parse(tag.value)))
      .map((tag) => tag.tag)
      .sort((a, b) => a.localeCompare(b)),
  ];
  const notFilteringByTypeExpectedValue = [[...expectedValue[0], 'extra-tag']];

  // Act
  const response = await getValuesTags({ values: valuesToFind, type, ctx });
  const responseForMissingValues = await getValuesTags({
    values: [...valuesToFind, 'non-existent-value'],
    type,
    ctx,
  });
  const notFilteringByTypeResponse = await getValuesTags({ values: valuesToFind, ctx });

  // Assert
  expect(response.sort((a, b) => a.localeCompare(b))).toEqual(expectedValue);
  expect(responseForMissingValues).toEqual([...expectedValue, []]);
  expect(notFilteringByTypeResponse).toEqual(notFilteringByTypeExpectedValue);
});

it.only('Should handle wrong or unexpected arguments and ignore unvalid "type" values', async () => {
  // Arrange
  const { initialData, tagsObjectFiltered } = tagsFixtures();
  const { values, type } = initialData;
  const wrongValues = {};
  const emptyValuesArray = [];
  const wrongType = {};
  const unexpectedWrongType = [{}];

  const ctx = generateCtx({
    models: {
      Tags: newModel(mongooseConnection, 'Tags', tagsSchema),
    },
  });

  const initialValues = _.cloneDeep(tagsObjectFiltered);
  await ctx.db.Tags.create(initialValues);

  // Act
  const responseWithWrongTypeOfValues = await getValuesTags({ values: wrongValues, type, ctx });
  const responseWithEmptyValuesArray = await getValuesTags({ values: emptyValuesArray, type, ctx });
  const testFnWithWrongType = async () => getValuesTags({ values, type: wrongType, ctx });
  const testFnWithUnexpectedWrongType = async () => getValuesTags({ values, type: unexpectedWrongType, ctx });

  // Assert
  expect(responseWithWrongTypeOfValues).toEqual([[]]);
  expect(responseWithEmptyValuesArray).toEqual([]);
  await expect(testFnWithWrongType).rejects.toThrow(LeemonsError);
  await expect(testFnWithUnexpectedWrongType).rejects.toThrow(LeemonsError);
});

it('Should not throw if required parameters are not passed and return an empty array instead', async () => {
  // Arrange
  const ctx = generateCtx({
    models: {
      Tags: newModel(mongooseConnection, 'Tags', tagsSchema),
    },
  });

  // Act
  const testFnWithNoValues = await getValuesTags({ ctx });

  // Assert
  expect(testFnWithNoValues).toEqual([]);
});
