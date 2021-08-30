const tables = {
  levels: leemons.query('plugins_classroom::levels'),
  levelSchemas: leemons.query('plugins_classroom::levelSchemas'),
};

module.exports = async function (schema, parentId = null, { transacting }) {
  if (!parentId && schema.parent) {
    return { ok: false, message: "The level needs to have a parent due to it's schema" };
  }

  let parentObj;
  let parentLevelSchema;

  try {
    parentObj = await tables.levels.findOne({ id: parentId }, { transacting });
  } catch (e) {
    console.log('TRPCBF');
    return { ok: false, message: "The referenced parent can't be fetched" };
  }
  if (!parentObj) {
    console.log('TRPDNE');
    return { ok: false, message: 'The referenced parent does not exists' };
  }
  try {
    parentLevelSchema = await tables.levelSchemas.findOne(
      { id: parentObj.schema },
      { transacting }
    );
  } catch (e) {
    console.log('TRPSCBF');
    return { ok: false, message: "The referenced parent's schema can't be fetched" };
  }

  if (schema.parent !== parentLevelSchema.id) {
    console.log('TRSNCWRP');
    return {
      ok: false,
      message: 'The referenced schema is not compatible with the referenced parent',
    };
  }
  console.log('OK');
  return { ok: true };
};
