const { keyBy } = require('lodash');

async function getClasses({ instances, ctx }) {
  const classesIds = instances.flatMap((instance) => instance.classes);
  const classesData = await ctx.tx.call('academic-portfolio.classes.classByIds', {
    ids: classesIds,
  });

  return keyBy(classesData, 'id');
}

module.exports = getClasses;
