const defaultFormatters = require('../../lib/format/index');

describe('Default Formatter', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern');
  });

  afterAll(() => {
    jest.useRealTimers();
  });
  test.each([
    [
      'level and message',
      {
        level: 'silly',
        message: 'A silly message',
      },
      () => ({
        level: 'SILLY',
        message: 'A silly message',
        timestamp: new Date().toISOString(),
      }),
    ],
    [
      'level, message, timestamp',
      {
        level: 'silly',
        message: 'A silly message',
        timestamp: new Date('2020-03-01').toISOString(),
      },
      () => ({
        level: 'SILLY',
        message: 'A silly message',
        timestamp: new Date('2020-03-01').toISOString(),
      }),
    ],
    [
      'level, message, printf like format',
      {
        level: 'silly',
        message: '%s %d %j',
        timestamp: new Date('2020-03-01').toISOString(),
        splat: ['Silly Message', 2, { name: 'leemons' }],
      },
      () => ({
        level: 'SILLY',
        message: 'Silly Message 2 {"name":"leemons"}',
        timestamp: new Date('2020-03-01').toISOString(),
      }),
    ],
  ])('%s test', (name, data, result) => {
    const mockedDate = Math.random() * 9e13;
    jest.setSystemTime(mockedDate);
    expect(defaultFormatters().transform(data)).toEqual(result());
  });
});
