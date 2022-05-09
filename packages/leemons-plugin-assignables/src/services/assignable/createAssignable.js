const _ = require('lodash');
const { validateAssignable } = require('../../helpers/validators/assignable');
const getRole = require('../roles/getRole');
const saveSubjects = require('../subjects/saveSubjects');
const { assignables } = require('../tables');
const versionControl = require('../versionControl');
const getAssignable = require('./getAssignable');
const { registerAssignablePermission } = require('./permissions');
const addPermissionToUser = require('./permissions/assignable/users/addPermissionToUser');
const saveAsset = require('../leebrary/assets/saveAsset');
const publishAssignable = require('./publishAssignable');

module.exports = async function createAssignable(
  assignable,
  { published = false, id: _id = null, userSession, transacting: t } = {}
) {
  // TODO: Add creation published/draft
  return global.utils.withTransaction(
    async (transacting) => {
      let id = _id;

      // EN: Verify assignable object properties.
      // ES: Verificar que el objeto asignable tenga las propiedades correctas.
      validateAssignable(assignable);

      const {
        asset: assignableAsset,
        subjects,
        submission,
        metadata,
        relatedAssignables,
        ...assignableObject
      } = assignable;

      // EN: Check if the role exists
      // ES: Comprueba si el rol existe
      await getRole.call(this, assignable.role, { transacting });

      // EN: Register a new versioned entity.
      // ES: Registra una nueva versión de una entidad.
      if (!id) {
        const version = await versionControl.register('assignable', {
          transacting,
        });
        id = version.fullId;
      }

      if (relatedAssignables?.before?.length || relatedAssignables?.after?.length) {
        try {
          // EN: Check every assignable exists
          // ES: Comprueba que todos los asignables existan
          await Promise.all(
            _.concat(relatedAssignables?.before, relatedAssignables?.after).map((a) =>
              getAssignable.call(this, a.id, { userSession, transacting })
            )
          );
        } catch (e) {
          throw new Error(
            "Some of the related assignables don't exists or you don't have permissions to access them"
          );
        }
      }

      // EN: Create the asset
      // ES: Crea el asset
      let asset;
      try {
        if (!_id) {
          const savedAsset = await saveAsset(
            { ...assignableAsset, category: `assignables.${assignable.role}`, public: true },
            { published: false, userSession, transacting }
          );

          asset = savedAsset.id;
        } else {
          asset = assignableAsset;
        }
      } catch (e) {
        throw new Error(`Error creating the asset: ${e.message}`);
      }

      // EN: Create the assignable for the given version.
      // ES: Crea el asignable para la versión dada.
      try {
        const assignableCreated = await assignables.create(
          {
            id,
            ...assignableObject,
            asset,
            relatedAssignables: JSON.stringify(relatedAssignables),
            submission: JSON.stringify(submission),
            metadata: JSON.stringify(metadata),
          },
          { transacting }
        );

        // EN: Register permission for assignable.
        // ES: Registra permisos para el asignable.
        await registerAssignablePermission(assignableCreated, { transacting });
        // EN: Add user permissions for assignable.
        // ES: Añade permisos de usuario para el asignable.
        await addPermissionToUser(
          assignableCreated,
          userSession.userAgents.map((u) => u.id),
          'owner',
          { userSession, transacting }
        );

        // EN: Save the subjects for the given assignable.
        // ES: Guarda los asignables para la versión dada.
        await saveSubjects(assignableCreated.id, subjects, { transacting });

        // EN: Publish the assignable if needed.
        // ES: Publica el asignable si es necesario.
        if (published) {
          await publishAssignable.call(this, assignableCreated.id, { transacting, userSession });
        }

        return { id: assignableCreated.id, ...assignable };
      } catch (e) {
        console.log(e);
        throw new Error(`Failed to create assignable: ${e.message}`);
      }
    },
    assignables,
    t
  );
};
