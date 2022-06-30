const { classes } = require('../tables');

module.exports = async function listClasses(
  { assignable, assignableInstance },
  { transacting } = {}
) {
  let query;

  if (assignable) {
    query = {
      assignable,
    };
  } else if (assignableInstance) {
    query = {
      assignableInstance,
    };
  } else {
    throw new Error('You must provide an assignable or an assignableInstance');
  }

  return classes.find(query, { transacting });
};
