const { groupBy } = require('lodash');
/**
 * Retrieves block(s) by their class ID(s) from the database.
 *
 * @param {Object} params - The parameters for the function.
 * @param {String|Array<String>} params.subjectId - The subject ID or IDs of the blocks to retrieve.
 * @param {Boolean} [params.groupBySubjectsWhenMultiple=true] - If true, groups the results by subject when multiple subjects are provided.
 * @param {Object} params.ctx - The context object containing the database connection.
 * @returns {Promise<(Array<Object> | Object)>} A promise that resolves to the blocks found, as an array when subjectId is a single subject ID string,
 * or an object when searching multiple subjects and groupBySubjectsWhenMultiple is true. For the latter cases, keys are the subject IDs and values are
 * the blocks found as an array.
 */
async function getRawBlocksBySubject({ subjectId, groupBySubjectsWhenMultiple = true, ctx }) {
  const multipleSubjects = Array.isArray(subjectId);
  const normalizedId = multipleSubjects ? subjectId : [subjectId];

  const results = await ctx.tx.db.Blocks.find({ subject: { $in: normalizedId } }).lean();

  if (multipleSubjects && groupBySubjectsWhenMultiple) {
    return groupBy(results, 'subject');
  }

  return results;
}

module.exports = { getRawBlocksBySubject };
