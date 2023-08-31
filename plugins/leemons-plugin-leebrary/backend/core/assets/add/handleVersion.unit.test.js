const {
  it,
  expect,
  jest: { fn },
} = require('@jest/globals');
const { generateCtx } = require('leemons-testing');

const { handleVersion } = require('./handleVersion');
const getCategory = require('../../../__fixtures__/getCategory');

it('Generates a new id by calling a different service or simply returns the id when passed', async () => {
  // Arrange
  const { categoryId } = getCategory();
  const id = 'already an id';

  const actionExpectedValue = {
    fullId: 'I am a full id',
  };

  const registerAction = fn(() => actionExpectedValue);

  const ctx = generateCtx({
    actions: {
      'common.versionControl.register': registerAction,
    },
  });

  // Act
  const response = await handleVersion({ categoryId, ctx });
  await handleVersion({ categoryId, published: true, ctx });
  const responseWhenId = await handleVersion({ newId: id, ctx });

  // Assert
  expect(response).toEqual(actionExpectedValue.fullId);
  expect(registerAction).nthCalledWith(1, {
    type: ctx.prefixPN(categoryId),
    published: undefined,
  });
  expect(registerAction).nthCalledWith(2, {
    type: ctx.prefixPN(categoryId),
    published: true,
  });
  expect(responseWhenId).toEqual(id);
});
