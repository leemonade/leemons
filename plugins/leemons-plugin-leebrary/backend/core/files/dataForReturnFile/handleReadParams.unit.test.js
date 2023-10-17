const { it, expect, describe } = require('@jest/globals');
const { handleReadParams } = require('./handleReadParams');

describe('handleReadParams', () => {
  it('should return correct read parameters when file size is greater than 0 and start and end bytes are valid', () => {
    // Arrange
    const file = { size: 100 };
    const start = 10;
    const end = 50;

    // Act
    const result = handleReadParams({ file, start, end });

    // Assert
    expect(result).toEqual({
      bytesStart: start,
      bytesEnd: end,
      readParams: {
        emitClose: false,
        flags: 'r',
        start,
        end,
      },
    });
  });

  it('should return -1 for start and end bytes when file size is 0 or start and end bytes are invalid', () => {
    // Arrange
    const file = { size: 0 };
    const start = -10;
    const end = -50;

    // Act
    const result = handleReadParams({ file, start, end });

    // Assert
    expect(result).toEqual({
      bytesStart: -1,
      bytesEnd: -1,
      readParams: {},
    });
  });

  it('should adjust end byte to be file size - 1 when end byte is greater than file size', () => {
    // Arrange
    const file = { size: 100 };
    const start = 10;
    const end = 150;

    // Act
    const result = handleReadParams({ file, start, end });

    // Assert
    expect(result).toEqual({
      bytesStart: start,
      bytesEnd: file.size - 1,
      readParams: {
        emitClose: false,
        flags: 'r',
        start,
        end: file.size - 1,
      },
    });
  });
});
