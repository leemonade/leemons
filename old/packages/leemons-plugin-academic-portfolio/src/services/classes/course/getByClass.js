const _ = require('lodash');
const { table } = require('../../tables');

async function getByClass(_class, { returnCourse, transacting } = {}) {
  const classCourses = await table.classCourse.find(
    { class_$in: _.isArray(_class) ? _class : [_class] },
    { transacting }
  );
  if (returnCourse) return _.map(classCourses, 'course');
  return classCourses;
}

module.exports = { getByClass };
