const { it, beforeEach, expect } = require('@jest/globals');

const { generateCtx } = require('@leemons/testing');

const { filterByPreferCurrent } = require('./filterByPreferCurrent');

const getCurrentVersionHandler = jest.fn();
const stringifyIdHandler = jest.fn();

const assignablesIds = [
  { uuid: 'uuid1', fullId: 'uuid1@1.0.0' },
  { uuid: 'uuid1', fullId: 'uuid1@0.0.5' },
  { uuid: 'uuid2', fullId: 'uuid2@1.0.0' },
];

describe('filterByPreferCurrent', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Should filter assignables preferring current', async () => {
    // Arrange
    const params = {
      assignablesIds,
      published: true,
      preferCurrent: true,
      ctx: generateCtx({
        actions: {
          'common.versionControl.getCurrentVersion': getCurrentVersionHandler,
          'common.versionControl.stringifyId': stringifyIdHandler,
        },
      }),
    };

    getCurrentVersionHandler.mockResolvedValue({ current: '1.0.0' });
    stringifyIdHandler
      .mockResolvedValueOnce('uuid1@1.0.0')
      .mockResolvedValueOnce('uuid2@1.0.0');

    // Act
    const result = await filterByPreferCurrent(params);

    // Assert
    expect(getCurrentVersionHandler).toHaveBeenNthCalledWith(1, {
      uuid: expect.stringContaining('uuid1'),
    });
    expect(getCurrentVersionHandler).toHaveBeenNthCalledWith(2, {
      uuid: expect.stringContaining('uuid2'),
    });
    expect(stringifyIdHandler).toHaveBeenNthCalledWith(1, {
      id: 'uuid1',
      version: '1.0.0',
    });
    expect(stringifyIdHandler).toHaveBeenNthCalledWith(2, {
      id: 'uuid2',
      version: '1.0.0',
    });
    expect(result).toEqual({
      uuid1: [{ uuid: 'uuid1', fullId: 'uuid1@1.0.0' }],
      uuid2: [{ uuid: 'uuid2', fullId: 'uuid2@1.0.0' }],
    });
  });

  it('Should not filter assignables if they are not published', async () => {
    // Arrange
    const params = {
      assignablesIds,
      published: true,
      preferCurrent: true,
      ctx: generateCtx({
        actions: {
          'common.versionControl.getCurrentVersion': getCurrentVersionHandler,
          'common.versionControl.stringifyId': stringifyIdHandler,
        },
      }),
    };

    getCurrentVersionHandler.mockResolvedValue({ current: null });
    stringifyIdHandler
      .mockResolvedValueOnce('uuid1@null')
      .mockResolvedValueOnce('uuid2@null');

    // Act
    const result = await filterByPreferCurrent(params);

    // Assert
    expect(getCurrentVersionHandler).toHaveBeenNthCalledWith(1, {
      uuid: expect.stringContaining('uuid1'),
    });
    expect(getCurrentVersionHandler).toHaveBeenNthCalledWith(2, {
      uuid: expect.stringContaining('uuid2'),
    });
    expect(stringifyIdHandler).toHaveBeenNthCalledWith(1, {
      id: 'uuid1',
      version: null,
    });
    expect(stringifyIdHandler).toHaveBeenNthCalledWith(2, {
      id: 'uuid2',
      version: null,
    });
    expect(result).toEqual({
      uuid1: [
        { uuid: 'uuid1', fullId: 'uuid1@1.0.0' },
        { uuid: 'uuid1', fullId: 'uuid1@0.0.5' },
      ],
      uuid2: [{ uuid: 'uuid2', fullId: 'uuid2@1.0.0' }],
    });
  });

  it('Should filter assignables not preferring current', async () => {
    // Arrange
    const params = {
      assignablesIds,
      published: true,
      preferCurrent: false,
      ctx: generateCtx({}),
    };

    // Act
    const result = await filterByPreferCurrent(params);

    // Assert
    expect(result).toEqual({
      uuid1: [
        { fullId: 'uuid1@1.0.0', uuid: 'uuid1' },
        { fullId: 'uuid1@0.0.5', uuid: 'uuid1' },
      ],
      uuid2: [{ fullId: 'uuid2@1.0.0', uuid: 'uuid2' }],
    });
  });

  it('Should return empty array when no assignables are found', async () => {
    // Arrange
    const params = {
      assignablesIds: [],
      published: true,
      preferCurrent: true,
      ctx: generateCtx({}),
    };

    // Act
    const result = await filterByPreferCurrent(params);

    // Assert
    expect(result).toEqual({});
  });
});
