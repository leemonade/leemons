const getEntity = require('./private/getEntity');
const getLevelSchema = require('../levelSchemas/private/getEntity');

module.exports = async function hasValidSchemaAndParent(schema, parentId = null, { transacting }) {
  /**
   * If the schema has a parent it means the level should also have it
   * On the other hand, if the schema does not have a parent, the level shouldn't have it neithers
   */
  if (!parentId && schema.parent) {
    return { ok: false, message: "The level needs to have a parent according to it's schema" };
  }

  if (parentId && !schema.parent) {
    return { ok: false, message: "The level can't have a parent according to it's schema" };
  }

  // If the schema does not have a parent nor the level have it, everything is ok
  if (!parentId) {
    return { ok: true };
  }

  let parentObj;
  let parentLevelSchema;
  // Get the parent (if exists)
  try {
    parentObj = await getEntity(parentId, { transacting });
  } catch (e) {
    return { ok: false, message: "The referenced parent can't be fetched" };
  }
  if (!parentObj) {
    return { ok: false, message: 'The referenced parent does not exists' };
  }
  // Get the parent's schema
  try {
    parentLevelSchema = await getLevelSchema(parentObj.schema, { transacting });
  } catch (e) {
    console.log(parentObj);
    return { ok: false, message: "The referenced parent's schema can't be fetched" };
  }

  // Check if the schema's parent (level.schema.parent) is the same as the parent' schema (level.parent.schema)
  if (schema.parent !== parentLevelSchema.id) {
    return {
      ok: false,
      message: 'The referenced schema is not compatible with the referenced parent',
    };
  }
  return { ok: true };
};
