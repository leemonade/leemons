const _ = require('lodash');

async function getGrades({ assignationsData, ctx }) {
  if (!assignationsData?.length) return {};
  const orQuery = [];

  assignationsData.forEach(({ user, id }) => {
    const isStudent = _.map(ctx.meta.userSession.userAgents, 'id').includes(user);

    const query = { assignation: id };
    if (isStudent) {
      query.visibleToStudent = true;
    }

    orQuery.push(query);
  });

  const gradesFound = await ctx.tx.db.Grades.find({ $or: orQuery }).find();

  return _.groupBy(gradesFound, 'assignation');
}

module.exports = { getGrades };
