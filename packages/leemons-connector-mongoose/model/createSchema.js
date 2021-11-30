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
    case 'text':
    case 'richtext':
      return String;
    case 'int':
    case 'integer':
    case 'bigint':
    case 'biginteger':
      return Number;
    case 'date':
      return Date;
    case 'buffer':
      return Buffer;
    case 'boolean':
    case 'bool':
      return Boolean;
    case 'mixed':
    case 'json':
    case 'jsonb':
      return Mixed;
    case 'objectid':
      return ObjectId;
    // TODO: Enum
    // TODO: Binary
    // TODO: uuid
    // case 'enum':
    // case 'enu':
    // case 'enumeration':
    // case 'array':
    // case 'uuid'
    // case 'binary':
    case 'number':
    case 'decimal':
    case 'float':
    case 'double':
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
