// eslint-disable-next-line no-use-before-define
module.exports = listClasses;

const { classes } = require('../tables');
const getAssignableInstance = require('../assignableInstance/getAssignableInstance');
const getAssignable = require('../assignable/getAssignable');

async function listClasses({ assignable, assignableInstance }, { userSession, transacting } = {}) {
  let query;

  if (assignable) {
    await getAssignable.call(this, assignable, { userSession, transacting });
    query = {
      assignable,
    };
  } else if (assignableInstance) {
    await getAssignableInstance.call(this, assignableInstance, { userSession, transacting });
    query = {
      assignableInstance,
    };
  } else {
    throw new Error('You must provide an assignable or an assignableInstance');
  }

  return classes.find(query, { transacting });
}
