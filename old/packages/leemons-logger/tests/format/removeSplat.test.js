const removeSplat = require('../../lib/format/removeSplat');

describe('levelUppercase formatter', () => {
  test.each([
    ['splat I', ['hi', { name: 'Miguel' }]],
    ['splat II', [123]],
    ['splat III', []],
    ['splat IV', null],
  ])('%s', (level, splat) => {
    if (!splat) {
      expect(removeSplat().transform({ more: 'info', must: 'be', kept: true })).toEqual({
        more: 'info',
        must: 'be',
        kept: true,
      });
    } else {
      expect(removeSplat().transform({ splat, more: 'info', must: 'be', kept: true })).toEqual({
        more: 'info',
        must: 'be',
        kept: true,
      });
    }
  });
});
