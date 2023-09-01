const {
  it,
  expect,
  jest: { spyOn },
} = require('@jest/globals');
const _ = require('lodash');

const { handleUserSessionData } = require('./handleUserSessionData');
const getUserSession = require('../../../__fixtures__/getUserSession');
const { generateCtx } = require('leemons-testing');

it('should correctly use userSession data to modify and return assetData', () => {
  // Arrange
  const mockedUserSession = getUserSession();
  const simpleAssetData = {
    name: 'mockName',
    fromUser: null,
    fromUserAgent: '007',
  };

  const ctx = generateCtx({});
  ctx.meta.userSession = { ...mockedUserSession };

  const expectedResult = {
    name: simpleAssetData.name,
    fromUser: mockedUserSession.id,
    fromUserAgent: mockedUserSession.userAgents[0].id,
  };
  const expectedResultNoUserAgents = {
    name: simpleAssetData.name,
    fromUser: mockedUserSession.id,
    fromUserAgent: null,
  };

  // Act
  const result = handleUserSessionData({
    assetData: { ...simpleAssetData },
    ctx,
  });

  ctx.meta.userSession.userAgents = null;
  const resultNoUserAgents = handleUserSessionData({
    assetData: { ...simpleAssetData },
    ctx,
  });

  // Assert
  expect(result).toEqual(expectedResult);
  expect(resultNoUserAgents).toEqual(expectedResultNoUserAgents);
});

it('should handle unexpected arguments without trhowing ', () => {
  // Arrange
  const mockedUserSession = getUserSession();
  const simpleAssetData = {
    name: 'mockName',
    fromUser: null,
    fromUserAgent: '007',
  };

  const ctx = generateCtx({});
  ctx.meta.userSession = {};
  const spyLogger = spyOn(ctx.logger, 'warn');

  // Act
  const testFnWithWrongArgs = () =>
    handleUserSessionData({
      assetData: { ...simpleAssetData },
      ctx,
    });

  const responseWithUnexpectedArgs = (() => {
    const modifiedCtx = {
      ...ctx,
      meta: { userSession: { ...mockedUserSession, userAgents: { id: 'wrong' } } },
    };
    const res = handleUserSessionData({
      assetData: { ...simpleAssetData },
      ctx: modifiedCtx,
    });
    return res;
  })();

  // Assert
  expect(testFnWithWrongArgs).not.toThrow();
  expect(spyLogger).toBeCalledTimes(1);
  expect(responseWithUnexpectedArgs.fromUserAgent).toBe(null)
});
