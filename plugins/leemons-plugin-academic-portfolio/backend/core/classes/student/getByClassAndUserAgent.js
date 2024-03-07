const _ = require('lodash');

async function getByClassAndUserAgent({ class: _class, userAgent, ctx }) {
  return ctx.tx.db.ClassStudent.find({
    class: _.isArray(_class) ? _class : [_class],
    student: _.isArray(userAgent) ? userAgent : [userAgent],
  }).lean();
}

module.exports = { getByClassAndUserAgent };
