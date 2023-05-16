const _ = require('lodash');
const { table } = require('../../tables');

async function getByClassAndUserAgent(_class, userAgent, { transacting } = {}) {
  return table.classStudent.find(
    {
      class_$in: _.isArray(_class) ? _class : [_class],
      student_$in: _.isArray(userAgent) ? userAgent : [userAgent],
    },
    { transacting }
  );
}

module.exports = { getByClassAndUserAgent };
