const _ = require('lodash');
const { table } = require('../tables');

async function getUserProgramIds(userSession, { transacting } = {}) {
  const userAgentIds = _.map(userSession.userAgents, 'id');
  const [stClasses, thClasses] = await Promise.all([
    table.classStudent.find({ student_$in: userAgentIds }, { transacting }),
    table.classTeacher.find({ teacher_$in: userAgentIds }, { transacting }),
  ]);

  const classeIds = _.uniq(_.map(stClasses, 'class').concat(_.map(thClasses, 'class')));

  const classes = await table.class.find(
    { id_$in: classeIds },
    { columns: ['program'], transacting }
  );
  return _.uniq(_.map(classes, 'program'));
}

module.exports = { getUserProgramIds };
