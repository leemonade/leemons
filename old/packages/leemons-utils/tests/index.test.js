const utils = require('../lib');
const { env } = require('../lib/env');
const { getModel, generateModelName } = require('../lib/model');
const buildQuery = require('../lib/queryBuilder');
const { parseFilters } = require('../lib/parseFilters');
const getStackTrace = require('../lib/getStackTrace');
const { getAvailablePort } = require('../lib/port');

describe('Test default export', () => {
  test.each([
    ['env', env],
    ['getModel', getModel],
    ['generateModelName', generateModelName],
    ['buildQuery', buildQuery],
    ['parseFilters', parseFilters],
    ['getStackTrace', getStackTrace],
    ['getAvailablePort', getAvailablePort],
  ])('exports %s', (name, func) => {
    expect(utils[name]).toEqual(func);
  });
});
