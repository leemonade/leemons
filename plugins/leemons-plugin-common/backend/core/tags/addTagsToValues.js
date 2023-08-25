const _ = require('lodash');
const { LeemonsError } = require('leemons-error');
const { validateTypePrefix } = require('../../validation/validate');

/**
 * Adds tags to values in the database.
 *
 * @async
 * @function
 * @param {Object} params - Parameters for adding tags to values.
 * @param {string} params.type - The type of tags to be added.
 * @param {(string|string[])} params.tags - Tag or an array of tags to be added.
 * @param {(string|string[])} params.values - Value or an array of values to be associated with the tags.
 * @param {Moleculer.Context} params.ctx - The Moleculer service invocation context.
 * @param {Object} params.ctx.tx - Transaction context.
 * @param {Object} params.ctx.tx.db - Database object.
 * @param {Object} params.ctx.tx.db.Tags - The Tags model to interact with.
 * @returns {Promise<Array<Object>>} - Returns an array of created tag documents.
 * @throws {LeemonsError} Throws an error if either `tags` or `values` are empty.
 */

async function addTagsToValues({ type, tags, values, ctx }) {
  validateTypePrefix({ type, calledFrom: ctx.callerPlugin, ctx });
  // Check if tags is empty
  if (!tags?.length || (_.isArray(tags) && !_.every(tags, _.isString))) {
    throw new LeemonsError(ctx, { message: `Tags cannot be empty.` });
  }
  // Check if values is empty
  if (!values?.length || (_.isArray(values) && !_.every(values, _.isString))) {
    throw new LeemonsError(ctx, { message: `Values cannot be empty.` });
  }

  const _tags = _.isArray(tags) ? tags : [tags];
  let _values = _.isArray(values) ? values : [values];
  _values = _.map(_values, (value) => JSON.stringify(value));

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
