const { validateTypePrefix } = require('../../validation/validate');
const { removeAllTagsForValues } = require('./removeAllTagsForValues');
const { addTagsToValues } = require('./addTagsToValues');

async function setTagsToValues({ type, tags, values, ctx }) {
  try {
    validateTypePrefix({ type, calledFrom: ctx.callerPlugin, ctx });
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
