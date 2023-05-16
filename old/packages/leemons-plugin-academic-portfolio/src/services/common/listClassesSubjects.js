const _ = require('lodash');
const { table } = require('../tables');
const { classByIds } = require('../classes/classByIds');
const { subjectByIds } = require('../subjects/subjectByIds');

async function listClassesSubjects({ program, course, group }, { transacting } = {}) {
  const query = { program };
  let ids = null;
  if (course) {
    const courseClass = await table.classCourse.find({ course }, { transacting });
    ids = _.map(courseClass, 'class');
  }
  if (group) {
    const groupClass = await table.classCourse.find({ group }, { transacting });
    if (_.isArray(ids)) {
      ids = ids.concat(_.map(groupClass, 'class'));
    } else {
      ids = _.map(groupClass, 'class');
    }
  }
  if (ids) query.id_$in = ids;

  let classes = await table.class.find(query, { columns: ['id'], transacting });
  classes = await classByIds(_.map(classes, 'id'), { transacting });

  const subjects = await subjectByIds(_.map(classes, 'subject'), { transacting });

  return { classes, subjects };
}

module.exports = { listClassesSubjects };
