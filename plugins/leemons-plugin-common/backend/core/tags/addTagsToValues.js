const _ = require('lodash');
const { LeemonsError } = require('leemons-error');
const { validateTypePrefix } = require('../../validation/validate');

async function addTagsToValues({ type, tags, values, ctx }) {
  validateTypePrefix({ type, calledFrom: ctx.callerPlugin, ctx });
  const _tags = _.isArray(tags) ? tags : [tags];
  let _values = _.isArray(values) ? values : [values];
  _values = _.map(_values, (value) => JSON.stringify(value));
  // Check if tag is not empty
  if (_tags.length === 0) {
    throw new LeemonsError(ctx, { message: `Tags cannot be empty.` });
  }
  // Check if value is not empty
  if (_values.length === 0) {
    throw new LeemonsError(ctx, { message: `Values cannot be empty.` });
  }

  const promises = [];

  _.forEach(_tags, (tag) => {
    _.forEach(_values, (value) => {
      promises.push(
        ctx.tx.db.Tags.create({ type, tag, value }).then((mongooseDoc) => mongooseDoc.toObject())
      );
    });
  });

  return Promise.all(promises);
}

module.exports = { addTagsToValues };
