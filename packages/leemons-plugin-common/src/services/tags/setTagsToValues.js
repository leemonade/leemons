const { table } = require('../tables');
const { validateTypePrefix } = require('../../validation/validate');
const { removeAllTagsForValues } = require('./removeAllTagsForValues');
const { addTagsToValues } = require('./addTagsToValues');

async function setTagsToValues(type, tags, values, { transacting: _transacting }) {
  return global.utils.withTransaction(
    async (transacting) => {
      validateTypePrefix(type, this.calledFrom);
      await removeAllTagsForValues.call(this, type, values, { transacting });
      try {
        return await addTagsToValues.call(this, type, tags, values, { transacting });
      } catch (error) {
        // console.log(error, error.message);
        if (error.message !== 'Tags cannot be empty.') {
          throw error;
        }
      }
    },
    table.tags,
    _transacting
  );
}

module.exports = { setTagsToValues };
