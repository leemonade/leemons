const { map, uniq } = require('lodash');

async function filterByClasses({ query, assignableInstancesIds, ctx }) {
  if (!(query.classes?.length || query.subjects?.length || query.programs?.length)) {
    return assignableInstancesIds;
  }
  let classesToSearch = query.classes || [];
  if ((query.subjects?.length || query.programs?.length) && !query.classes?.length) {
    let classesFound = await ctx.tx.db.Classes.find({
      assignableInstance: assignableInstancesIds,
    })
      .select(['assignableInstance', 'class'])
      .lean();

    classesFound = uniq(map(classesFound, 'class'));
    const classesData = await ctx.tx.call('academic-portfolio.classes.classByIds', {
      ids: classesFound,
    });

    classesFound = classesFound.map((classFound) => {
      const klass = classesData.find((c) => c.id === classFound);

      return {
        id: classFound,
        subject: klass.subject.id,
        program: klass.program,
      };
    });

    classesToSearch = map(
      classesFound.filter(
        (klass) =>
          (query.subjects?.length && query.subjects.includes(klass.subject)) ||
          (query.programs?.length && query.programs.includes(klass.program))
      ),
      'id'
    );
  }

  const results = await ctx.tx.db.Classes.find({
    class: classesToSearch,
    assignableInstance: assignableInstancesIds,
  }).lean();

  return uniq(map(results, 'assignableInstance'));
}

module.exports = {
  filterByClasses,
};
