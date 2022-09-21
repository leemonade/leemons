const { uniq, map } = require('lodash');
const { classes } = require('../tables');

module.exports = async function searchAssignableInstanceBySubject(klass) {
  const classesFound = await classes.find(
    {
      class: klass,
    },
    { columns: ['assignableInstance'] }
  );

  return uniq(map(classesFound, 'assignableInstance'));
};
