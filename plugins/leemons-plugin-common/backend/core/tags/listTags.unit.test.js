const {
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  jest: { resetAllMocks },
} = require('@jest/globals');
const { generateCtx, createMongooseConnection } = require('leemons-testing');
const { newModel } = require('leemons-mongodb');

const { listTags } = require('./listTags');
const { tagsSchema } = require('../../models/tags');
const { LeemonsError } = require('leemons-error');

jest.mock('leemons-mongodb-helpers');
const mongodbHelpersModule = require('leemons-mongodb-helpers');
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

afterEach(() => {
  resetAllMocks();
});

it('Should call mongoDBPaginate properly and return its result filtering the items', async () => {
  // Arrange
  const { tagsObjectFiltered, listTagsArguments, mongoDBPaginateReturnValue } = tagsFixtures();
  const { page, size, query } = listTagsArguments;

  const ctx = generateCtx({
    models: {
      Tags: newModel(mongooseConnection, 'Tags', tagsSchema),
    },
  });

  await ctx.db.Tags.create(tagsObjectFiltered);
  mongodbHelpersModule.mongoDBPaginate.mockResolvedValue(mongoDBPaginateReturnValue);

  const expectedValue = {
    ...mongoDBPaginateReturnValue,
    items: mongoDBPaginateReturnValue.items.map((tag) => tag.tag),
  };

  // Act
  const response = await listTags({ page, size, query, ctx });

  // Assert
  expect(mongodbHelpersModule.mongoDBPaginate).toHaveBeenCalledWith(
    expect.objectContaining({ model: ctx.tx.db.Tags, page, size, query, columns: ['tag'] })
  );
  expect(response).toEqual(expectedValue);
});

it('Should throw if unexpected parameters are passed and provide a default value for query', async () => {
  // Arrange
  const { tagsObjectFiltered, listTagsArguments, mongoDBPaginateEmptyReturnValue } = tagsFixtures();
  const { page, size, query } = listTagsArguments;
  const wrongPageType = '6';
  const wrongSizeType = [];
  const wrongQuery = [{ foo: 'foo' }];
  const queryForUnexistingValues = { foo: 'foo' };

  const ctx = generateCtx({
    models: {
      Tags: newModel(mongooseConnection, 'Tags', tagsSchema),
    },
  });

  await ctx.db.Tags.create(tagsObjectFiltered);
  mongodbHelpersModule.mongoDBPaginate.mockResolvedValue(mongoDBPaginateEmptyReturnValue);
  const expectedValue = mongoDBPaginateEmptyReturnValue;

  // Act
  const testFnWithInvalidPage = async () => listTags({ page: wrongPageType, size, query, ctx });
  const testFnWithInvalidSize = async () => listTags({ page, size: wrongSizeType, query, ctx });
  const testFnWithInvalidQuery = async () => listTags({ page, size, query: wrongQuery, ctx });
  const emtpyResults = await listTags({ page, size, query: queryForUnexistingValues, ctx });

  // Assert
  await expect(testFnWithInvalidPage).rejects.toThrow(LeemonsError);
  await expect(testFnWithInvalidSize).rejects.toThrow(LeemonsError);
  await expect(testFnWithInvalidQuery).rejects.toThrow(LeemonsError);
  expect(emtpyResults).toEqual(expectedValue);
});

it('Should throw if required parameters are not passed', async () => {
  // Arrange
  const { page, size } = tagsFixtures().listTagsArguments;

  const ctx = generateCtx({
    models: {
      Tags: newModel(mongooseConnection, 'Tags', tagsSchema),
    },
  });

  // Act
  const testFnWithInvalidPage = async () => listTags({ size, ctx });
  const testFnWithInvalidSize = async () => listTags({ page, ctx });

  // Assert
  await expect(testFnWithInvalidPage).rejects.toThrow(LeemonsError);
  await expect(testFnWithInvalidSize).rejects.toThrow(LeemonsError);
});
