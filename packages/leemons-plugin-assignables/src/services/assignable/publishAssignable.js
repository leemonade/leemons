const _ = require('lodash');
const {
  validateAssignable,
  assignableValidationObject,
  validAssignableProperties,
} = require('../../helpers/validators/assignable');
const updateAsset = require('../leebrary/assets/updateAsset');
const versionControl = require('../versionControl');
const getAssignable = require('./getAssignable');
const getUserPermission = require('./permissions/assignable/users/getUserPermission');

function validateDataForPublish(assignable) {
  const validationObject = _.cloneDeep(assignableValidationObject);

  validateAssignable(_.pick(assignable, validAssignableProperties), {
    validationObject,
    useRequired: ['asset', 'role', 'subjects'],
  });
}

module.exports = async function publishAssignable(assignableId, { userSession, transacting }) {
  // EN: Get the assignable to validate ownership.
  // ES: Obtiene el asignable para validar la propiedad.
  let assignable = await getAssignable.call(this, assignableId, { userSession, transacting });

  if (assignable.deleted) {
    throw new Error('The assignable is deleted');
  }

  assignable = _.omit(assignable, ['roleDetails', 'deleted']);

  // EN: Validate that all the required fields are filled.
  // ES: Valida que todos los campos requeridos están llenos.
  validateDataForPublish(assignable);

  // TODO: Add required properties verification

  // EN: Check if the user has permission to publish the assignable.
  // ES: Comprueba si el usuario tiene permiso para publicar el asignable.
  const { actions } = await getUserPermission(assignable, { userSession, transacting });

  if (!actions.includes('edit')) {
    throw new Error('You do not have permission to publish this assignable.');
  }

  // EN: Publish the asset.
  // ES: Publica el asset.
  await updateAsset(assignable.asset, { published: true, userSession, transacting });

  // EN: Publish the version.
  // ES: Publica la versión.
  await versionControl.publishVersion(assignableId, true, { setAsCurrent: true, transacting });

  return true;
};
