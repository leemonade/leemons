const listClasses = require('./listClasses');

module.exports = function listAssignableClasses(assignable, { userSession, transacting }) {
  return listClasses.call(this, { assignable }, { userSession, transacting });
};
