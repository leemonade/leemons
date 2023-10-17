const _ = require('lodash');

async function gradeTagsInGradeScale({ gradeScale, ctx }) {
  return ctx.tx.db.GradeTags.countDocuments({
    scale: _.isArray(gradeScale) ? gradeScale : [gradeScale],
  });
}

module.exports = { gradeTagsInGradeScale };
