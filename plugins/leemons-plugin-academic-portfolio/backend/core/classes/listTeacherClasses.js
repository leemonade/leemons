const _ = require('lodash');
const { mongoDBPaginate } = require('leemons-mongodb-helpers');
const { classByIds } = require('./classByIds');

async function listTeacherClasses({ page, size, teacher, ctx }) {
  const response = await mongoDBPaginate({
    model: ctx.tx.db.ClassTeacher,
    page,
    size,
    query: { teacher: _.isArray(teacher) ? teacher : [teacher] },
  });

  response.items = await classByIds({ ids: _.map(response.items, 'class'), ctx });

  return response;
}

module.exports = { listTeacherClasses };
