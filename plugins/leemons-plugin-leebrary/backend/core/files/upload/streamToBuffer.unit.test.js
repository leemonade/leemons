const { expect, it } = require('@jest/globals');
const { Readable } = require('stream');

const { streamToBuffer } = require('./streamToBuffer');

it('should resolve with a buffer when the stream ends', async () => {
  // Arrange
  const mockData = Buffer.from('test data');
  const readStream = Readable.from([mockData]);

  // Act
  const result = await streamToBuffer(readStream);

  // Assert
  expect(result).toEqual(Buffer.from(mockData));
});

it('should reject with an error when the stream errors', async () => {
  // Arrange
  const mockError = new Error('test error');
  const readStream = new Readable({
    read() {
      this.emit('error', mockError);
    },
  });

  // Act
  let error;
  try {
    await streamToBuffer(readStream);
  } catch (e) {
    error = e;
  }

  // Assert
  expect(error).toBe(mockError);
});

it('should handle multiple chunks of data', async () => {
  // Arrange
  const mockData = ['test', 'data'].map(Buffer.from);
  const readStream = Readable.from(mockData);

  // Act
  const result = await streamToBuffer(readStream);

  // Assert
  expect(result).toEqual(Buffer.concat(mockData.map(Buffer.from)));
});
