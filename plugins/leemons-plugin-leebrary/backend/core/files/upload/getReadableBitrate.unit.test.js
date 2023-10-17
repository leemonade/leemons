const { expect, it } = require('@jest/globals');
const { getReadableBitrate } = require('./getReadableBitrate');

it('Should return correct bitrate for various inputs', () => {
  // Arrange
  const testCases = [
    { bitrate: 500000, expected: '500.0 kbps' },
    { bitrate: 500000000, expected: '500.0 Mbps' },
    { bitrate: 500000000000, expected: '500.0 Gbps' },
    { bitrate: 500000000000000, expected: '500.0 Tbps' },
    { bitrate: 500000000000000000, expected: '500.0 Pbps' },
    { bitrate: 500000000000000000000, expected: '500.0 Ebps' },
    { bitrate: 500000000000000000000000, expected: '500.0 Zbps' },
    { bitrate: 500000000000000000000000000, expected: '500.0 Ybps' },
    { bitrate: 50, expected: '0.1 kbps' },
  ];

  testCases.forEach(({ bitrate, expected }) => {
    // Act
    const result = getReadableBitrate(bitrate);

    // Assert
    expect(result).toBe(expected);
  });
});

it('Should return 0.1 kbps when the final bitrate is less than 0.1', () => {
  // Arrange
  const bitrate = 50;

  // Act
  const result = getReadableBitrate(bitrate);

  // Assert
  expect(result).toBe('0.1 kbps');
});

it('Should prevent infinite loops', () => {
  // Arrange
  const bitrate = -1;

  // Act
  const result = getReadableBitrate(bitrate);

  // Assert
  expect(result).toBe('-1');
});
