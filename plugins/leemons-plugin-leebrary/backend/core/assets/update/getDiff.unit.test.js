const { describe, expect, test } = require('@jest/globals');
const { getDiff } = require('./getDiff');

describe('getDiff function', () => {
  test('should return the same object and an empty diff array when both input objects are the same', () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { a: 1, b: 2 };

    const result = getDiff(obj1, obj2);

    expect(result).toEqual({ object: obj1, diff: [] });
  });

  test('should return the merged object and the diff array when the input objects are different', () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { a: 1, b: 3 };

    const result = getDiff(obj1, obj2);

    expect(result).toEqual({ object: { a: 1, b: 2 }, diff: ['b'] });
  });
});
