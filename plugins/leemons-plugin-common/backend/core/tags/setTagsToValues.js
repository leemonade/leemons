const { validateTypePrefix } = require('../../validation/validate');
const { removeAllTagsForValues } = require('./removeAllTagsForValues');
const { addTagsToValues } = require('./addTagsToValues');

// eslint-disable-next-line consistent-return
async function setTagsToValues({ type, tags, values, ctx }) {
  validateTypePrefix({ type, calledFrom: ctx.callerPlugin, ctx });
  try {
    await removeAllTagsForValues({ type, values, ctx });
    return addTagsToValues({ type, tags, values, ctx });
  } catch (error) {
    if (error.message === 'Tags cannot be empty.') {
      return null;
    }
    throw error;
  }
}

module.exports = { setTagsToValues };
