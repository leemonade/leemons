const { it, expect } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');
const { LeemonsError } = require('@leemons/error');

const { checkAndHandleCanUse } = require('./checkAndHandleCanUse');
const getCategory = require('../../../__fixtures__/getCategory');

const unauthorizedPlugin = 'unauthorized-plugin';
const authorizedPlugin = 'authorized-plugin';
const { categoryObject } = getCategory();

it('Should throw if the caller is not authorized', () => {
  // Arrange
  const categoryWithCanUseArray = { ...categoryObject, canUse: [authorizedPlugin] };

  const ctx = generateCtx({
    caller: categoryObject.pluginOwner,
  });
  const expectedValue = [ctx.prefixPN(''), categoryObject.pluginOwner];

  // Act
  const response = checkAndHandleCanUse({
    category: { ...categoryObject },
    calledFrom: ctx.callerPlugin,
    ctx,
  });
  const testFnWhenUnauthorized = () =>
    checkAndHandleCanUse({
      category: categoryWithCanUseArray,
      calledFrom: unauthorizedPlugin,
      ctx,
    });
  const responseAuthorizedPlugin = checkAndHandleCanUse({
    category: categoryWithCanUseArray,
    calledFrom: authorizedPlugin,
    ctx,
  });

  // Assert
  expect(response).toEqual(expectedValue);
  expect(testFnWhenUnauthorized).toThrow(
    new LeemonsError(ctx, {
      message: `Category "${categoryObject.key}" was not created by the "${unauthorizedPlugin}" plugin. You can only add assets to categories created by the "${unauthorizedPlugin}" plugin.`,
      httpStatusCode: 403,
    })
  );
  expect(responseAuthorizedPlugin).toEqual([...expectedValue, authorizedPlugin]);
});

it('Should handle unexpected values and throw unauthorization errors', () => {
  // Arrange
  const categoryWithWrongCanUseValue = { ...categoryObject, canUse: '"[]"' };
  const ctx = generateCtx({});

  // Act
  const testFnWithWrongData = () =>
    checkAndHandleCanUse({
      category: { ...categoryWithWrongCanUseValue, key: undefined },
      calledFrom: unauthorizedPlugin,
      ctx,
    });
  expect(testFnWithWrongData).toThrow(LeemonsError);
});
