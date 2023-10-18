const { omit, uniq } = require('lodash');

const { getInstance } = require('../getInstance');
/**
 * Create a related instance.
 *
 * @param {object} options - The options object.
 * @param {string} options.caller - The ID of the caller instance.
 * @param {object} options.relation - The relation object.
 * @param {string} options.type - The type of relation ('before' or 'after').
 * @param {boolean} [options.propagate=true] - Whether to propagate the relation.
 * @param {MoleculerContext} options.ctx - The Moleculer context object.
 * @return {object} The created or updated relation object.
 */
async function createRelatedInstance({ caller, relation, type, propagate = true, ctx }) {
  // Require inside function to avoid circular dependency
  // eslint-disable-next-line global-require
  const { updateInstance } = require('./updateInstance');
  // Require inside function to avoid circul∫ar dependency
  // eslint-disable-next-line global-require
  const { createInstance } = require('../createInstance');

  const oppositeType = type === 'before' ? 'after' : 'before';

  // EN: Given instance is an id
  // ES: La instancia dada es un id
  if (relation.id) {
    const relatedInstance = await getInstance({ id: relation.id, ctx });
    if (!relatedInstance) {
      throw new Error(`The related instance ${relation.id} does not exists`);
    }

    // EN: Update the relatedInstance to add the current instance as related
    // ES: Actualizar la instancia relacionada para añadir la instancia actual como relacionada
    if (propagate) {
      await updateInstance({
        assignableInstance: {
          id: relation.id,
          relatedAssignableInstances: {
            ...relatedInstance.relatedAssignableInstances,
            [type]: relatedInstance.relatedAssignableInstances?.[type] || [],
            [oppositeType]: uniq([
              ...(relatedInstance.relatedAssignableInstances?.[oppositeType] || []),
              { ...relation, id: caller },
            ]),
          },
        },
        propagateRelated: false,
        ctx,
      });
    }

    return relation;
  }

  // EN: Given instance is an object
  // ES: La instance dada es un objeto

  const createdInstance = await createInstance({
    assignableInstance: {
      ...relation.instance,
      relatedAssignableInstances: {
        [type]: relation.instance.relatedAssignableInstances?.[type] || [],
        [oppositeType]: uniq([
          ...(relation.instance.relatedAssignableInstances?.[oppositeType] || []),
          caller.id,
        ]),
      },
    },
    ctx,
  });

  return { ...omit(relation, ['id', 'instance']), id: createdInstance.id };
}

module.exports = { createRelatedInstance };
