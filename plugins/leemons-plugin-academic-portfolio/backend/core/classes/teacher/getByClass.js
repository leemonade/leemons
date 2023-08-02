const _ = require('lodash');

async function getByClass({ class: _class, ctx }) {
  return ctx.tx.db.ClassTeacher.find({ class: _.isArray(_class) ? _class : [_class] }).lean();
}

module.exports = { getByClass };
