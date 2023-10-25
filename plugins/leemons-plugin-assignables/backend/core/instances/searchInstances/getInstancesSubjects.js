const { map, uniq } = require('lodash');

async function getInstancesSubjects({ instances, ctx }) {
  const instancesClasses = await ctx.tx.db.Classes.find({
    assignableInstance: instances,
  })
    .select(['assignableInstance', 'class'])
    .lean();

  const dedupedClasses = uniq(map(instancesClasses, 'class'));

  const apClasses = await ctx.tx.call('academic-portfolio.classes.classByIds', {
    ids: dedupedClasses,
  });

  const subjectsPerClass = apClasses.reduce(
    (acc, klass) => ({
      ...acc,
      [klass.id]: klass.subject.id,
    }),
    {}
  );

  return instancesClasses.reduce(
    (acc, instance) => ({
      ...acc,
      [instance.assignableInstance]: [
        ...(acc[instance.assignableInstance] || []),
        subjectsPerClass[instance.class],
      ],
    }),
    {}
  );
}

module.exports = {
  getInstancesSubjects,
};
