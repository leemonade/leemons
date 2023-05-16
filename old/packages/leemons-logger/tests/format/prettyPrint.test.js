const prettyPrint = require('../../lib/format/prettyPrint');

describe('prettyPrint formatter', () => {
  let prevDate = null;
  const date = () => {
    prevDate = new Date(Math.random() * 10e6).toISOString();
    return prevDate;
  };
  test.each([
    [
      '1 label',
      {
        timestamp: date(),
        level: 'error',
        labels: { service: 'front' },
        message: 'This is a log msg',
      },
      `${prevDate} error [front] This is a log msg`,
    ],
    [
      '2 labels (one is pid)',
      {
        timestamp: date(),
        level: 'warn',
        labels: { pid: 127, service: 'back' },
        message: 'This is another log msg',
      },
      `${prevDate} warn [back] This is another log msg`,
    ],
    [
      '1 label (not service label)',
      {
        timestamp: date(),
        level: 'info',
        labels: { test: 'test' },
        message: 'This is a standard message',
      },
      `${prevDate} info [test] This is a standard message`,
    ],
    [
      '2 labels',
      {
        timestamp: date(),
        level: 'http',
        labels: { test1: 'test1', test2: 'test2' },
        message: 'test',
      },
      `${prevDate} http [test1, test2] test`,
    ],
    [
      'no label',
      {
        timestamp: date(),
        level: 'verbose',
        message: 'This is a log msg',
      },
      `${prevDate} verbose This is a log msg`,
    ],
    [
      'empty json label, numeric message',
      {
        timestamp: date(),
        level: 'debug',
        labels: {},
        message: 123,
      },
      `${prevDate} debug 123`,
    ],
    [
      'pid label, array message',
      {
        timestamp: date(),
        level: 'silly',
        labels: { pid: 123 },
        message: ['1', '2', '3'],
      },
      `${prevDate} silly 1,2,3`,
    ],
    [
      'metadata',
      {
        timestamp: date(),
        level: 'silly',
        message: 'Has metadata',
        metadata: true,
        leemons: { is: 'the best' },
      },
      `${prevDate} silly Has metadata {"metadata":true,"leemons":{"is":"the best"}}`,
    ],
  ])('%s test', (name, data, result) => {
    expect(prettyPrint.template(data)).toBe(result);
  });
});
