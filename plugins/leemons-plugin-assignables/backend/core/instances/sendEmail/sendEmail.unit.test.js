const {
  beforeEach,
  describe,
  test,
  expect,
  jest: { spyOn },
} = require('@jest/globals');
const { set } = require('lodash');

const { generateCtx } = require('leemons-testing');

const { sendEmail } = require('./sendEmail');

const { getInstanceObject } = require('../../../__fixtures__/getInstanceObject');

const getConfigHandle = jest.fn();
const sendAsEducationalCenterHandle = jest.fn();

const instance = {
  ...getInstanceObject,
  dates: { deadline: Date.now() },
  assignable: { asset: { id: 'assetId' } },
};

beforeEach(() => {
  jest.resetAllMocks();
});

describe('sendEmail function', () => {
  test('should send email successfully', async () => {
    // Arrange
    const ctx = generateCtx({
      actions: {
        'emails.config.getConfig': getConfigHandle,
        'emails.email.sendAsEducationalCenter': sendAsEducationalCenterHandle,
        'leebrary.assets.getCoverUrl': jest.fn(() => '/api/leebrary/img/assetId'),
      },
    });

    getConfigHandle.mockResolvedValueOnce(true).mockResolvedValueOnce(1);

    const spyLogger = spyOn(ctx.logger, 'log');

    const mockParams = {
      instance,
      userAgent: { user: { id: 'userId' }, center: { id: 'centerId' } },
      classes: [],
      hostname: 'localhost',
      ignoreUserConfig: false,
      isReminder: false,
      ctx,
    };

    // Act
    await sendEmail(mockParams);

    // Assert
    expect(getConfigHandle).toHaveBeenNthCalledWith(1, {
      userAgent: 'userId',
      keys: 'new-assignation-email',
    });
    expect(getConfigHandle).toHaveBeenNthCalledWith(2, {
      userAgent: 'userId',
      keys: 'new-assignation-per-day-email',
    });
    expect(sendAsEducationalCenterHandle).toHaveBeenCalledWith({
      templateName: 'user-create-assignation',
      context: {
        instance: {
          dates: { deadline: expect.any(Number) },
          assignable: {
            asset: { id: 'assetId', color: '#D9DCE0', url: 'localhost/api/leebrary/img/assetId' },
          },
        },
        classes: [],
        classColor: '#67728E',
        btnUrl: 'localhost/private/assignables/ongoing',
        subjectIconUrl: null,
        taskDate: expect.any(String),
        userSession: {
          userAgents: [{ id: 'userAgentId' }],
          avatarUrl: null,
        },
      },
      centerId: 'centerId',
    });
    expect(spyLogger).toHaveBeenCalled();
    //   `Email enviado a ${mockParams.userAgent.user.email}`
    // );
  });

  test('should not send email if canSend is false', async () => {
    // Arrange
    const ctx = generateCtx({
      actions: {
        'emails.config.getConfig': getConfigHandle,
        'emails.email.sendAsEducationalCenter': sendAsEducationalCenterHandle,
        'leebrary.assets.getCoverUrl': jest.fn(() => '/api/leebrary/img/assetId'),
      },
    });

    getConfigHandle.mockResolvedValueOnce(false).mockResolvedValueOnce(0);

    const mockParams = {
      instance,
      userAgent: { user: { id: 'userId' }, center: { id: 'centerId' } },
      classes: [],
      hostname: 'localhost',
      hostnameApi: 'localhost',
      ignoreUserConfig: false,
      isReminder: false,
      ctx,
    };

    // Act
    await sendEmail(mockParams);

    // Assert
    expect(getConfigHandle).toHaveBeenNthCalledWith(1, {
      userAgent: 'userId',
      keys: 'new-assignation-email',
    });
    expect(getConfigHandle).toHaveBeenNthCalledWith(2, {
      userAgent: 'userId',
      keys: 'new-assignation-per-day-email',
    });
    expect(sendAsEducationalCenterHandle).not.toHaveBeenCalled();
  });

  test('should handle error when sending email fails', async () => {
    // Arrange
    const ctx = generateCtx({
      actions: {
        'emails.config.getConfig': getConfigHandle,
        'emails.email.sendAsEducationalCenter': sendAsEducationalCenterHandle,
        'leebrary.assets.getCoverUrl': jest.fn(() => '/api/leebrary/img/assetId'),
      },
    });

    set(ctx, 'request.header.origin', 'localhost');
    set(ctx, 'meta.userSession.avatar', '/url');

    getConfigHandle.mockResolvedValueOnce(true).mockResolvedValueOnce(1);

    const spyLogger = spyOn(ctx.logger, 'error');

    sendAsEducationalCenterHandle.mockImplementation(() => {
      throw new Error('Failed to send Email');
    });

    const mockParams = {
      instance: { ...instance, dates: { ...instance.dates, deadline: undefined } },
      userAgent: { user: { id: 'userId' }, center: { id: 'centerId' } },
      classes: [{ color: '#67728E' }],
      ignoreUserConfig: false,
      isReminder: true,
      ctx,
    };

    // Act
    await sendEmail(mockParams);

    // Assert
    expect(spyLogger).toHaveBeenCalledTimes(1);
  });

  test('should handle error when getting config fails', async () => {
    // Arrange
    const ctx = generateCtx({
      actions: {
        'emails.config.getConfig': getConfigHandle,
        'emails.email.sendAsEducationalCenter': sendAsEducationalCenterHandle,
        'leebrary.assets.getCoverUrl': jest.fn(() => '/api/leebrary/img/assetId'),
      },
    });

    const spyLogger = spyOn(ctx.logger, 'error');

    getConfigHandle.mockImplementation(() => {
      throw new Error('Failed getting Config');
    });

    const mockParams = {
      instance,
      userAgent: { user: { id: 'userId' }, center: { id: 'centerId' } },
      classes: [],
      hostname: 'localhost',
      hostnameApi: 'localhost',
      ignoreUserConfig: false,
      isReminder: false,
      ctx,
    };

    // Act
    await sendEmail(mockParams);

    // Assert
    expect(spyLogger).toHaveBeenCalledTimes(1);
  });
});
