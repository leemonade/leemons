const _ = require('lodash');
const { mongoDBPaginate } = require('leemons-mongodb-helpers');
const { classByIds } = require('./classByIds');

async function listStudentClasses({ page, size, student, ctx }) {
  const response = await mongoDBPaginate({
    model: ctx.tx.db.ClassStudent,
    page,
    size,
    query: { student: _.isArray(student) ? student : [student] },
  });

  response.items = await classByIds({ ids: _.map(response.items, 'class'), ctx });

  return response;
}

module.exports = { listStudentClasses };
