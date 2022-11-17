const _ = require('lodash');
const { scores } = require('../tables');

module.exports = async function getScores(
  { students, classes, instances, periods, published, gradedBy } = {},
  { userSession, transacting } = {}
) {
  // TODO: Verify it can be deleted by this user

  const query = {};

  if (students?.length) {
    query.student_$in = students;
  }
  if (classes?.length) {
    query.class_$in = classes;
  }
  if (instances?.length) {
    query.instance_$in = instances;
  }
  if (periods?.length) {
    query.period_$in = periods;
  }
  if (gradedBy?.length) {
    query.gradedBy_$in = gradedBy;
  }
  if (published !== undefined) {
    query.published = published;
  }

  if (!Object.keys(_.omit(query, ['published'])).length) {
    throw new Error(
      `Error getting scores: at least one of: students, classes, instances, periods or gradedBy is required`
    );
  }

  const scoresFound = await scores.find(query, { transacting });

  return scoresFound.map((score) => ({ ...score, grade: parseFloat(score.grade) }));
};
