const {
  Schema: {
    Types: { Mixed, Decimal128, ObjectId },
  },
  Schema: MongoSchema,
} = require('mongoose');

function getType(property) {
  // Get the mongoose equivalent type
  switch (property?.type?.toLowerCase()) {
    case 'string':
      return String;
    case 'number':
    case 'int':
    case 'integer':
      return Number;
    case 'date':
      return Date;
    case 'buffer':
      return Buffer;
    case 'boolean':
    case 'bool':
      return Boolean;
    case 'mixed':
      return Mixed;
    case 'objectid':
      return ObjectId;
    // case 'array':
    case 'decimal':
    case 'float':
    case 'double':
    case 'decimal128':
      return Decimal128;
    // case 'map':
    default:
      return null;
  }
}

function createSchema(schema) {
  const attributes = Object.entries(schema.schema.attributes)
    .map(([name, attribute]) => {
      const type = getType(attribute);
      return {
        name,
        type,
      };
    })
    .filter((attribute) => attribute.type);
  const Schema = {};
  attributes.forEach((attribute) => {
    Schema[attribute.name] = attribute.type;
  });

  const MS = new MongoSchema(Schema);
  return { name: schema.modelName, schema: MS };
}

module.exports = createSchema;
