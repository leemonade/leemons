const chalk = require('chalk');
const colorize = require('../../lib/format/colorize');

describe('colorize formatter', () => {
  test.each([
    [
      'timestamp',
      { timestamp: '2021-03-01' },
      { timestamp: chalk`{${colorize.colors.timestamp} 2021-03-01}` },
    ],
    ['error', { level: 'error' }, { level: chalk`{${colorize.colors.error} error}` }],
    ['warn', { level: 'warn' }, { level: chalk`{${colorize.colors.warn} warn}` }],
    ['info', { level: 'info' }, { level: chalk`{${colorize.colors.info} info}` }],
    ['http', { level: 'http' }, { level: chalk`{${colorize.colors.http} http}` }],
    ['verbose', { level: 'verbose' }, { level: chalk`{${colorize.colors.verbose} verbose}` }],
    ['debug', { level: 'debug' }, { level: chalk`{${colorize.colors.debug} debug}` }],
    ['silly', { level: 'silly' }, { level: chalk`{${colorize.colors.silly} silly}` }],
    [
      'labels',
      {
        labels: {
          service: 'back',
        },
      },
      { labels: { service: chalk`{${colorize.colors.labels} back}` } },
    ],

    [
      'level,  timestamp, label and extra',
      {
        level: 'info',
        timestamp: '2021-03-01',
        labels: { pid: 3543, service: 'back' },
        metada: ':D',
      },
      {
        level: chalk`{${colorize.colors.info} info}`,
        timestamp: chalk`{${colorize.colors.timestamp} 2021-03-01}`,
        labels: {
          pid: chalk`{${colorize.colors.labels} 3543}`,
          service: chalk`{${colorize.colors.labels} back}`,
        },
        metada: ':D',
      },
    ],
  ])('%s test', (name, data, result) => {
    expect(colorize().transform(data)).toStrictEqual(result);
  });
});
