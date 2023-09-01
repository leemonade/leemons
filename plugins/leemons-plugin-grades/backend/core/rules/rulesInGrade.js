const _ = require('lodash');

async function rulesInGrade({ grade, ctx }) {
  return ctx.tx.db.Rules.countDocuments({ grade: _.isArray(grade) ? grade : [grade] });
}

module.exports = { rulesInGrade };
