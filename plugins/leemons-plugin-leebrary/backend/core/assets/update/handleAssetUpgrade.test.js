const { describe, expect, it } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { handleAssetUpgrade } = require('./handleAssetUpgrade');

jest.mock('../duplicate');
const { duplicate } = require('../duplicate');

describe('handleAssetUpgrade', () => {
  it('should handle asset upgrade', async () => {
    // Arrange

    const assetId = 'testAssetId';
    const scale = 'major';
    const published = true;
    const fullId = 'newAssetId';

    const upgradeVersionHandler = jest.fn(() => ({
      fullId,
    }));
    const ctx = generateCtx({
      actions: {
        'common.versionControl.upgradeVersion': upgradeVersionHandler,
      },
    });

    duplicate.mockResolvedValue({ assetId: fullId });

    // Act
    const result = await handleAssetUpgrade({ assetId, scale, published, ctx });

    // Assert
    expect(upgradeVersionHandler).toHaveBeenCalledWith({
      id: assetId,
      upgrade: scale,
      published,
    });
    expect(duplicate).toHaveBeenCalledWith({
      assetId,
      preserveName: true,
      newId: fullId,
      ctx,
    });
    expect(result).toEqual({ assetId: fullId });
  });
});
