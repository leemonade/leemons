const {
  it,
  expect,
  afterEach,
  jest: { resetAllMocks },
} = require('@jest/globals');
const { LeemonsError } = require('leemons-error');
const { generateCtx } = require('leemons-testing');
const { setTagsToValues } = require('./setTagsToValues');

jest.mock('./addTagsToValues');
jest.mock('./removeAllTagsForValues');

const addTagsToValues = require('./addTagsToValues');
const removeAllTagsForValues = require('./removeAllTagsForValues');
const tagsFixtures = require('../../__fixtures__/tagsFixtures');

afterEach(() => {
  resetAllMocks();
});

it('Should call dependencies with correct arguments and return expected value', async () => {
  // Arrange
  const { initialData, tagsObjectFiltered: expectedValue } = tagsFixtures();
  const { type, tags, values } = initialData;

  const ctx = generateCtx({
    caller: 'leemons-test',
  });

  addTagsToValues.addTagsToValues.mockResolvedValue(expectedValue);

  // Act
  const response = await setTagsToValues({ type, tags, values, ctx });

  // Assert
  expect(removeAllTagsForValues.removeAllTagsForValues).toHaveBeenCalledWith(
    expect.objectContaining({ type, values, ctx })
  );
  expect(addTagsToValues.addTagsToValues).toHaveBeenCalledWith(
    expect.objectContaining({ type, tags, values, ctx })
  );
  expect(response).toEqual(expectedValue);
});

it('Should let pass errors due to empty tags but throw any other error', async () => {
  // Arrange
  const { tags, values, type } = tagsFixtures().initialData;

  const ctx = generateCtx({
    caller: 'leemons-test',
  });

  addTagsToValues.addTagsToValues.mockImplementation(() => {
    throw new LeemonsError(ctx, { message: 'Tags cannot be empty.' });
  });

  // Act
  const resultWithEmptyTags = await setTagsToValues({
    type,
    tags: [],
    values,
    ctx,
  });
  const testFnWithWrongType = async () =>
    setTagsToValues({
      type: 88,
      tags,
      values,
      ctx,
    });
  const testFunctionWithInvalidArgument = async () => setTagsToValues(88);

  // Assert
  expect(resultWithEmptyTags === null).toBeTruthy();
  expect(testFnWithWrongType).rejects.toThrow();
  expect(testFunctionWithInvalidArgument).rejects.toThrow();
});

// setTagsToValues itself doesn't contain logic to validate its inputs, it relies on its dependencies to
// throw if they get incorrect inputs.
