const { validateTypePrefix } = require('../../validation/validate');
const { removeAllTagsForValues } = require('./removeAllTagsForValues');
const { addTagsToValues } = require('./addTagsToValues');

// eslint-disable-next-line consistent-return
async function setTagsToValues({ type, tags, values, ctx }) {
  validateTypePrefix({ type, calledFrom: ctx.callerPluggin, ctx });
  await removeAllTagsForValues({ type, values, ctx });

  try {
    return await addTagsToValues({ type, tags, values, ctx });
  } catch (error) {
    if (error.message !== 'Tags cannot be empty.') {
      throw error;
    }
  }
}

module.exports = { setTagsToValues };
