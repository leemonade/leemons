const { table } = require('../tables');
const { validateTypePrefix } = require('../../validation/validate');
const { removeAllTagsForValues } = require('./removeAllTagsForValues');
const { addTagsToValues } = require('./addTagsToValues');

async function setTagsToValues(type, tags, values, { transacting: _transacting }) {
  return global.utils.withTransaction(
    async (transacting) => {
      validateTypePrefix(type, this.calledFrom);
      await removeAllTagsForValues(type, values, { transacting });
      return addTagsToValues(type, tags, values, { transacting });
    },
    table.tags,
    _transacting
  );
}

module.exports = { setTagsToValues };
