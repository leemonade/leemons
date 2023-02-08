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
const duplicateAsset = require('../leebrary/assets/duplicateAsset');

module.exports = async function createAssignable(
  assignable,
  { published = false, id: _id = null, userSession, transacting: t } = {}
) {
  /*
    1. Validate (if published, apply publish validation)
    2. Validate role
    4. Create main asset
    5. Save resources
    6. Save metadata.leebrary resources

    7. Create the assignable
    8. Register assignable permissions
    9. Add permission to user
    10. Save subjects
    11. Publish (Do not go to dedicated publish)
  */

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
        resources,
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
          e.message =
            "Some of the related assignables don't exists or you don't have permissions to access them";

          throw e;
        }
      }

      // EN: Create the asset
      // ES: Crea el asset
      let asset;
      try {
        if (!_id) {
          // console.log(subjects);
          const assetProgram = subjects?.length ? subjects[0].program : null;
          const assetSubjects = subjects?.length
            ? subjects.map(({ subject, level }) => ({ subject, level }))
            : null;

          const savedAsset = await saveAsset(
            {
              ...assignableAsset,
              program: assetProgram,
              subjects: assetSubjects,
              category: `assignables.${assignable.role}`,
              public: true,
            },
            { published: false, userSession, transacting }
          );

          asset = savedAsset.id;
        } else {
          asset = assignableAsset;
        }
      } catch (e) {
        e.message = `Error creating the asset: ${e.message}`;
        throw e;
      }

      // EN: Create the resources
      // ES: Crea los recursos
      let resourcesToSave = null;
      if (resources?.length) {
        const newResources = await Promise.all(
          resources.map((resource) =>
            duplicateAsset(resource, {
              preserveName: true,
              public: 1,
              indexable: 0,
              userSession,
              transacting,
            })
          )
        );

        resourcesToSave = newResources.map((resource) => resource.id);
      }

      if (metadata?.leebrary) {
        const parsedAssets = Object.entries(metadata.leebrary).map(async ([key, value]) => {
          if (Array.isArray(value)) {
            return [
              key,
              await Promise.all(
                value.map(async (v) => {
                  const savedAsset = await duplicateAsset(v, {
                    preserveName: true,
                    public: 1,
                    indexable: 0,
                    userSession,
                    transacting,
                  });

                  return savedAsset.id;
                })
              ),
            ];
          }
          return [
            key,
            (
              await duplicateAsset(value, {
                preserveName: true,
                public: 1,
                indexable: 0,
                userSession,
                transacting,
              })
            ).id,
          ];
        });

        metadata.leebrary = Object.fromEntries(await Promise.all(parsedAssets));
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
            resources: JSON.stringify(resourcesToSave),
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

        return { id: assignableCreated.id, ...assignable, resources: resourcesToSave };
      } catch (e) {
        e.message = `Failed to create assignable: ${e.message}`;
        throw e;
      }
    },
    assignables,
    t
  );
};
