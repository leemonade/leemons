const { it, expect, describe } = require('@jest/globals');
const { LeemonsValidator } = require('@leemons/validator');
const { validateAddAsset, validateSetPermissions, validateAddBookmark } = require('./forms');

describe('Form Validations', () => {
  describe('validateAddAsset', () => {
    // eslint-disable-next-line sonarjs/no-duplicate-string
    it('should validate correctly when all required fields are present', async () => {
      // Arrange
      const data = {
        name: 'Test Asset',
        categoryId: '123',
      };

      // Act
      const result = await validateAddAsset(data);

      // Assert
      expect(result).toBeUndefined();
    });

    // eslint-disable-next-line sonarjs/no-duplicate-string
    it('should throw an error when required fields are missing', async () => {
      // Arrange
      const data = {
        name: 'Test Asset',
      };

      // Act and Assert
      await expect(validateAddAsset(data)).rejects.toThrow(LeemonsValidator.error);
    });
  });

  describe('validateSetPermissions', () => {
    it('should validate correctly when all required fields are present', async () => {
      // Arrange
      const data = {
        assets: ['123'],
        isPublic: true,
      };

      // Act
      const result = await validateSetPermissions(data);

      // Assert
      expect(result).toBeUndefined();
    });

    it('should throw an error when required fields are missing', async () => {
      // Arrange
      const data = {
        assets: ['123'],
      };

      // Act and Assert
      await expect(validateSetPermissions(data)).rejects.toThrow(LeemonsValidator.error);
    });
  });

  describe('validateAddBookmark', () => {
    it('should validate correctly when all required fields are present', async () => {
      // Arrange
      const data = {
        url: 'http://example.com',
        assetId: '123',
      };

      // Act
      const result = await validateAddBookmark(data);

      // Assert
      expect(result).toBeUndefined();
    });

    it('should throw an error when required fields are missing', async () => {
      // Arrange
      const data = {
        url: 'http://example.com',
      };

      // Act and Assert
      await expect(validateAddBookmark(data)).rejects.toThrow(LeemonsValidator.error);
    });
  });
});
