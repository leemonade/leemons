const listClasses = require('./listClasses');

module.exports = function listAssignableInstanceClasses(assignableInstance, { transacting }) {
  return listClasses.call(this, { assignableInstance }, { transacting });
};
