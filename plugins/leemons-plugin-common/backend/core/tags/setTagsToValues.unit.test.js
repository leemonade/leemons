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

afterEach(() => {
  resetAllMocks();
});

it('Should call dependencies with correct arguments and return expected value', async () => {
  // Arrange
  const tags = ['test-tag'];
  const type = 'leemons-test.my-type';
  const values = ['value1'];

  const ctx = generateCtx({
    caller: 'leemons-test',
  });

  const expectedValue = [{ tag: 'test-tag', value: '"value1"', type: 'leemons-test.my-type' }];

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
  const tags = ['test-tag'];
  const type = 'leemons-test.my-type';
  const values = ['value1'];

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

  // Assert
  expect(resultWithEmptyTags === null).toBeTruthy();
  expect(testFnWithWrongType).rejects.toThrow();
});

it('Should throw a LeemonsError if required parameters are not passed', () => {
  // Arrange
  const tags = ['test-tag'];
  const type = 'leemons-test.my-type';
  const values = ['value1'];
  // act
  const testFunctionWithInvalidArgument = async () => setTagsToValues(88);
  const testFunctionWithoutCtx = async () => setTagsToValues({ type, tags, values });
  // assert
  expect(testFunctionWithInvalidArgument).rejects.toThrow(LeemonsError);
  expect(testFunctionWithoutCtx).rejects.toThrow(LeemonsError);
});
