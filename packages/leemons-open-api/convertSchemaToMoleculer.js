function convertAJVSchemaToMoleculer(ajvSchema) {
  if (!ajvSchema.properties) return {};

  const fastestSchema = {};
  Object.keys(ajvSchema.properties).forEach((key) => {
    const value = ajvSchema.properties[key];
    if (value.properties) {
      fastestSchema[key] = convertAJVSchemaToMoleculer(value);
      fastestSchema.$$type = 'object';
    } else if (value.type === 'array') {
      fastestSchema[key] = { type: 'array', items: value.items.type };
    } else if (Array.isArray(value.type)) {
      fastestSchema[key] = {
        type: value.type,
      };
    } else fastestSchema[key] = { type: value.type };

    if (ajvSchema.required?.includes(key) && fastestSchema[key]) {
      fastestSchema[key].optional = false;
    }

    if (ajvSchema.additionalProperties === false) {
      fastestSchema[key].$$strinct = true;
    }
  });

  return fastestSchema;
}

function convertSchemaToMoleculer(schema) {
  if (!schema) return schema;

  let convertedSchema = schema;

  if (schema.properties || schema.type === 'object') {
    convertedSchema = convertAJVSchemaToMoleculer(schema);
  }

  console.log('SCHEMA', convertedSchema);

  return convertedSchema;
}

module.exports = { convertSchemaToMoleculer };
