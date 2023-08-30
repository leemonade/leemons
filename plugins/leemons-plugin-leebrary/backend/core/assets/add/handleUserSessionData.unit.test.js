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
    userSession: { ...mockedUserSession },
    ctx,
  });

  const resultNoUserAgents = handleUserSessionData({
    assetData: { ...simpleAssetData },
    userSession: { ...mockedUserSession, userAgents: null },
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
  const spyLogger = spyOn(ctx.logger, 'warn');

  // Act
  const testFnWithWrongArgs = () =>
    handleUserSessionData({
      assetData: { ...simpleAssetData },
      userSession: {},
      ctx,
    });
  const testFnWithUnexpectedArgs = () =>
    handleUserSessionData({
      assetData: { ...simpleAssetData },
      userSession: { ...mockedUserSession, userAgents: 'wrong value with length' },
      ctx,
    });

  // Assert
  expect(testFnWithWrongArgs).not.toThrow();
  expect(testFnWithUnexpectedArgs).not.toThrow();
  expect(spyLogger).toBeCalledTimes(1);
});
