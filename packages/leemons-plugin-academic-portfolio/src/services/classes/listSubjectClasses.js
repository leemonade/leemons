const _ = require('lodash');
const { table } = require('../tables');
const { classByIds } = require('./classByIds');

async function listSubjectClasses(page, size, subject, { query, transacting } = {}) {
  const response = await global.utils.paginate(table.class, page, size, query || { subject }, {
    transacting,
  });

  response.items = await classByIds(_.map(response.items, 'id'), { transacting });

  return response;
}

module.exports = { listSubjectClasses };
