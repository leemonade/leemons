const { it, expect, beforeEach } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');
const { filterByPublished } = require('./filterByPublished');

const getVersionHandler = jest.fn();

describe('filterByPublished', () => {
  let ctx;
  let assignablesIds;
  let assignablesWithControlVersion;

  beforeEach(() => {
    jest.resetAllMocks();
    ctx = generateCtx({
      actions: {
        'common.versionControl.getVersion': getVersionHandler,
      },
    });
    assignablesIds = [{ id: '1' }, { id: '2' }, { id: '3' }];
    assignablesWithControlVersion = [
      { id: '1', uuid: 'uuid1', published: true },
      { id: '2', uuid: 'uuid2', published: false },
      { id: '3', uuid: 'uuid3', published: true },
    ];
  });

  it('Should return all assignables when published is "all"', async () => {
    // Arrange
    const published = 'all';
    getVersionHandler.mockResolvedValue(assignablesWithControlVersion);

    // Act
    const result = await filterByPublished({ assignablesIds, published, ctx });

    // Assert
    expect(result).toHaveLength(3);
    expect(result).toEqual(
      expect.arrayContaining(assignablesWithControlVersion)
    );
  });

  it('Should return only published assignables when published is true', async () => {
    // Arrange
    const published = true;
    getVersionHandler.mockResolvedValue(assignablesWithControlVersion);

    // Act
    const result = await filterByPublished({ assignablesIds, published, ctx });

    // Assert
    expect(result).toHaveLength(2);
    expect(result).toEqual(
      expect.arrayContaining([
        assignablesWithControlVersion[0],
        assignablesWithControlVersion[2],
      ])
    );
  });

  it('Should return only unpublished assignables when published is false', async () => {
    // Arrange
    const published = false;
    getVersionHandler.mockResolvedValue(assignablesWithControlVersion);

    // Act
    const result = await filterByPublished({ assignablesIds, published, ctx });

    // Assert
    expect(result).toHaveLength(1);
    expect(result).toEqual(
      expect.arrayContaining([assignablesWithControlVersion[1]])
    );
  });
});
