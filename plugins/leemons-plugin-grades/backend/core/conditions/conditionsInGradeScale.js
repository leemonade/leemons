const _ = require('lodash');

async function conditionsInGradeScale({ gradeScale, ctx }) {
  return ctx.tx.db.Conditions.countDocuments({
    targetGradeScale: _.isArray(gradeScale) ? gradeScale : [gradeScale],
  });
}

module.exports = { conditionsInGradeScale };
