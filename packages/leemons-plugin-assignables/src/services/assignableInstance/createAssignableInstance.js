const _ = require('lodash');
const { validateAssignableInstance } = require('../../helpers/validators/assignableInstance');
const getAssignable = require('../assignable/getAssignable');
const { assignableInstances } = require('../tables');

module.exports = async function createAssignableInstance(
  assignableInstance,
  { userSession, transacting } = {}
) {
  // EN: Validate the assignable instance propperties
  // ES: Validar las propiedades del asignable instance
  validateAssignableInstance(assignableInstance, { useRequired: true });

  const { dates, classes, metadata, curriculum, relatedAssignables, ...assignableInstanceObj } =
    assignableInstance;

  // EN: Check that the assignable exists (if not, it will throw)
  // ES: Comprueba que el asignable existe (if not, it will throw)
  const assignable = await getAssignable.call(this, assignableInstance.assignable, {
    userSession,
    transacting,
  });

  // EN: Check if the assignable has related assignables and create them
  // ES: Comprueba si el asignable tiene asignables relacionados y los crea
  const relatedAssignableInstances = [];
  if (
    assignable.relatedAssignables?.after?.length ||
    assignable.relatedAssignables?.before?.length
  ) {
    const assignables = _.concat(
      assignable?.relatedAssignables?.after,
      assignable?.relatedAssignables?.before
    );

    // EN: Create the assignableInstance of each related assignable
    // ES: Crea el asignableInstance de cada asignable relacionado
    relatedAssignableInstances.push(
      await Promise.all(
        assignables.map((ass) =>
          createAssignableInstance.call(
            this,
            {
              // EN: If no info provided for the assignable, use the info of the parent assignableInstance
              // ES: Si no se proporciona información para el asignable, usa la información del asignableInstance padre
              ...assignableInstance,
              assignable: ass.id,
              ..._.get(relatedAssignables, assignable.id, {}),
            },
            { userSession, transacting }
          )
        )
      )
    );
  }

  // EN: Create the assignable instance
  // ES: Crea el asignable instance
  await assignableInstances.create(
    {
      ...assignableInstanceObj,

      metadata: JSON.stringify(metadata),
      curriculum: JSON.stringify(curriculum),
    },
    { transacting }
  );

  return {
    ...assignableInstanceObj,
    dates,
    classes,
    metadata,
    curriculum,
    relatedAssignableInstances,
  };

  // TODO: Register the item
  // TODO: Add permissions to the user
};
