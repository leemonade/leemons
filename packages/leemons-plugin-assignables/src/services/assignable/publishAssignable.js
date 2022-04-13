const versionControl = require('../versionControl');
const getAssignable = require('./getAssignable');

module.exports = async function publishAssignable(assignable, { transacting }) {
  // EN: Get the assignable to validate ownership.
  // ES: Obtiene el asignable para validar la propiedad.
  await getAssignable.call(this, assignable, { transacting });

  // EN: Publish the version.
  // ES: Publica la versión.
  await versionControl.publishVersion(assignable, true, { setAsCurrent: true, transacting });

  return true;
};
