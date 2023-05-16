const _ = require('lodash');
const { table } = require('../tables');
const { validateUpdateClassMany } = require('../../validations/forms');
const { updateClass } = require('./updateClass');

async function updateClassMany(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateUpdateClassMany(data, { transacting });
      const { ids, ...rest } = data;
      return Promise.all(_.map(ids, (id) => updateClass({ id, ...rest }, { transacting })));
    },
    table.class,
    _transacting
  );
}

module.exports = { updateClassMany };
