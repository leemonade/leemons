const { classes } = require('../tables');
const listClasses = require('./listClasses');

module.exports = async function listAssignableInstanceClasses(instances, { transacting }) {
  if (!Array.isArray(instances)) {
    return listClasses.call(this, { assignableInstance: instances }, { transacting });
  }

  const instancesClasses = await classes.find(
    { assignableInstance_$in: instances },
    { columns: ['class', 'assignableInstance'], transacting }
  );

  const classesPerInstance = {};

  instancesClasses.forEach((klass) => {
    const { assignableInstance: instance, class: classId } = klass;
    if (!classesPerInstance[instance]) {
      classesPerInstance[instance] = [classId];
    } else {
      classesPerInstance[instance].push(classId);
    }
  });

  return classesPerInstance;
};
