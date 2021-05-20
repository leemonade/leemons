const levelSameLength = require('../../lib/format/levelSameLength');

describe('levelSameLength formatter', () => {
  test.each([
    ['error', 'error  '],
    ['warn', 'warn   '],
    ['info', 'info   '],
    ['http', 'http   '],
    ['verbose', 'verbose'],
    ['debug', 'debug  '],
    ['silly', 'silly  '],
  ])('%s level', (level, result) => {
    expect(levelSameLength().transform({ level, more: 'info', must: 'be', kept: true })).toEqual({
      level: result,
      more: 'info',
      must: 'be',
      kept: true,
    });
  });
});
