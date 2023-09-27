const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');
const { validateTypePrefix } = require('../../validation/validate');

async function removeAllValuesForTags({ type, tags, ctx }) {
  validateTypePrefix({ type, calledFrom: ctx.callerPlugin, ctx });
  const _tags = _.isArray(tags) ? tags : [tags];
  // Check if tags is not empty
  if (_tags.length === 0) {
    throw new LeemonsError(ctx, { message: `Tags cannot be empty.` });
  }

  return ctx.tx.db.Tags.deleteMany({ type, tag: _tags });
}

module.exports = { removeAllValuesForTags };
