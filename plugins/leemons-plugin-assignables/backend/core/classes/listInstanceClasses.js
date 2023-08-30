const { listClasses } = require('./listClasses');

async function listInstanceClasses({ id, ctx }) {
  if (!Array.isArray(id)) {
    return listClasses({ instance: id, ctx });
  }

  const classes = await ctx.tx.db.Classes.find({
    assignableInstance: id,
  })
    .select(['class', 'assignableInstance'])
    .lean();

  const classesPerInstance = {};

  classes.forEach(({ assignableInstance: instance, class: classId }) => {
    if (!classesPerInstance[instance]) {
      classesPerInstance[instance] = [classId];
    } else {
      classesPerInstance[instance].push(classId);
    }
  });

  return classesPerInstance;
}

module.exports = { listInstanceClasses };
