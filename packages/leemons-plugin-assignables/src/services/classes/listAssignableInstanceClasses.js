const listClasses = require('./listClasses');

module.exports = function listAssignableInstanceClasses(
  assignableInstance,
  { userSession, transacting }
) {
  return listClasses.call(this, { assignableInstance }, { userSession, transacting });
};
