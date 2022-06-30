const path = require('path');
const getStackTrace = require('../lib/getStackTrace');

function checkStackTraceArray(stack) {
  expect(Array.isArray(stack)).toBeTruthy();
  expect(stack.length).toBeLessThanOrEqual(10);
  stack.forEach((element) => {
    expect(element).toHaveProperty('fileName');
    expect(element).toHaveProperty('lineNumber');
    expect(element).toHaveProperty('columnNumber');
    expect(element).toHaveProperty('functionName');
  });
}

function checkStackTraceProperties(stack, values) {
  Object.entries(values).forEach(([key, value]) => {
    expect(stack[key]).toBe(value);
  });
}

function intermediate(param) {
  return getStackTrace(param);
}

describe('StackTrace', () => {
  describe('call getStackTrace', () => {
    test('with no params', () => {
      const stack = getStackTrace();

      checkStackTraceArray(stack);
    });

    test('with no params, check 3 calls', () => {
      const stack = intermediate();

      checkStackTraceArray(stack);

      // GetStackTrace function
      checkStackTraceProperties(stack[0], {
        fileName: path.join(__dirname, '../lib/getStackTrace.js'),
        functionName: 'getStackTrace',
      });

      // intermediate function
      checkStackTraceProperties(stack[1], {
        fileName: path.join(__dirname, '/getStackTrace.test.js'),
        functionName: 'intermediate',
      });

      // test function
      checkStackTraceProperties(stack[2], {
        fileName: path.join(__dirname, '/getStackTrace.test.js'),
        functionName: 'test',
      });
    });

    test('with param 0', () => {
      const stack = intermediate(0);

      // GetStackTrace function
      checkStackTraceProperties(stack, {
        fileName: path.join(__dirname, '../lib/getStackTrace.js'),
        functionName: 'getStackTrace',
      });
    });

    test('with param < 0', () => {
      const stack = intermediate(-1);

      expect(stack).toBeNull();
    });

    test('with param > 10 (10 use to be the max stack trace, but can be lower)', () => {
      const stack = intermediate(11);

      expect(stack).toBeNull();
    });
  });
});
