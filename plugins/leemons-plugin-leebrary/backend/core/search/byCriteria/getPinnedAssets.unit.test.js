const { it, expect, beforeAll, beforeEach, describe } = require('@jest/globals');
const { generateCtx } = require('@leemons/testing');

const { getPinnedAssets } = require('./getPinnedAssets');
const getAssets = require('../../../__fixtures__/getAssets');
const getPins = require('../../../__fixtures__/getPins');

jest.mock('../../pins/getByUser');
const { getByUser: getPinsByUser } = require('../../pins/getByUser');

describe('getPinnedAssets', () => {
  let ctx;
  let asset;
  let pin;

  beforeAll(async () => {
    ctx = generateCtx({});
    asset = getAssets().assetModel;
    pin = getPins().pin;
    pin.asset = '88e36023-4a4a-48d9-b996-20e8b74e0d9c@1.0.0';
  });

  beforeEach(async () => {
    jest.resetAllMocks();
  });

  describe('Intended workload', () => {
    it('should return pinned assets if they exist', async () => {
      // Arrange
      const pinned = true;
      getPinsByUser.mockResolvedValue([pin]);
      // Act
      const result = await getPinnedAssets({ pinned, ctx });
      // Assert
      expect(getPinsByUser).toBeCalledWith({ ctx });
      expect(result).toEqual({ assets: [asset.id], nothingFound: false });
    });
  });

  describe('Limit use cases', () => {
    it('should return empty array if no pinned assets', async () => {
      // Arrange
      const pinned = true;
      getPinsByUser.mockResolvedValue([]);
      // Act
      const result = await getPinnedAssets({ pinned, ctx });
      // Assert
      expect(getPinsByUser).toBeCalledWith({ ctx });
      expect(result).toEqual({ assets: [], nothingFound: false });
    });

    it('should not call getPinsByUser if pinned is false', async () => {
      // Arrange
      const pinned = false;
      // Act
      const result = await getPinnedAssets({ pinned, ctx });
      // Assert
      expect(getPinsByUser).not.toBeCalled();
      expect(result).toEqual({ assets: [], nothingFound: false });
    });

    it('should return nothingFound true if getPinsByUser returns not an array', async () => {
      // Arrange
      const pinned = true;
      getPinsByUser.mockResolvedValue(null);
      // Act
      const result = await getPinnedAssets({ pinned, ctx });
      // Assert
      expect(getPinsByUser).toBeCalledWith({ ctx });
      expect(result).toEqual({ assets: [], nothingFound: true });
    });
  });

  describe('Error handling', () => {
    it('should throw an error if getPinsByUser fails', async () => {
      // Arrange
      const pinned = true;
      getPinsByUser.mockRejectedValue(new Error('Test error'));
      // Act
      const testFunc = async () => getPinnedAssets({ pinned, ctx });
      // Assert
      await expect(testFunc).rejects.toThrow('Test error');
    });
  });
});
