const levelUppercase = require('../../lib/format/levelUppercase');

describe('levelUppercase formatter', () => {
  test.each([
    ['error', 'ERROR'],
    ['warn', 'WARN'],
    ['info', 'INFO'],
    ['http', 'HTTP'],
    ['verbose', 'VERBOSE'],
    ['debug', 'DEBUG'],
    ['silly', 'SILLY'],
  ])('%s level', (level, result) => {
    expect(levelUppercase().transform({ level, more: 'info', must: 'be', kept: true })).toEqual({
      level: result,
      more: 'info',
      must: 'be',
      kept: true,
    });
  });
});
