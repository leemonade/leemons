const {
  Schema: {
    Types: { Mixed, Decimal128, ObjectId },
  },
  Schema: MongoSchema,
} = require('mongoose');

function getType(property, ctx) {
  // Get the mongoose equivalent type
  switch (property?.type?.toLowerCase()) {
    case 'string':
    case 'text':
    case 'richtext':
      return { type: String };
    case 'int':
    case 'integer':
    case 'bigint':
    case 'biginteger':
      return { type: Number };
    case 'date':
      return { type: Date };
    case 'buffer':
      return { type: Buffer };
    case 'boolean':
    case 'bool':
      return { type: Boolean };
    case 'mixed':
    case 'json':
    case 'jsonb':
      return { type: Mixed };
    case 'objectid':
      return { type: ObjectId };
    case 'uuid':
      return {
        type: String,
        validate: {
          validator(v) {
            return /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gm.test(
              v
            );
          },
          message: (props) => `${props.value} is not a valid UUID!`,
        },
      };
    case 'enu':
    case 'enumeration':
      if (!Array.isArray(property.values)) {
        return null;
      }

      if (property.enum.every((value) => typeof value === 'string')) {
        return {
          type: String,
          enum: property.enum,
        };
      }

      if (property.enum.every((value) => typeof value === 'number')) {
        return {
          type: Number,
          enum: property.enum,
        };
      }
      return null;
    case 'array':
      return { type: [getType({ type: property.of }, ctx)] };
    case 'number':
    case 'decimal':
    case 'float':
    case 'double':
      return { type: Decimal128 };
    // case 'map':
    default:
      if (ctx.schemas.has(property.type)) {
        return { type: ctx.schemas.get(property.type) };
      }
      return null;
  }
}

function getOptions(property) {
  const options = {};
  if (property.options) {
    Object.entries(property.options).forEach(([name, value]) => {
      if (value === true) {
        switch (name.toLowerCase()) {
          case 'unique':
            options.unique = true;
            break;
          case 'index':
            options.sparse = true;
            break;
          case 'notnullable':
          case 'notnull':
            options.required = '{PATH} is required!';
            break;
          default:
        }
      } else if (value !== undefined) {
        switch (name.toLowerCase()) {
          case 'defaultto':
            options.default = value;
            break;
          default:
        }
      }
    });
  }

  return options;
}

function createSchema(schema, ctx) {
  const attributes = Object.entries(schema.schema.attributes)
    .map(([name, attribute]) => ({
      name,
      ...getType(attribute, ctx),
      ...getOptions(attribute),
    }))
    .filter((attribute) => attribute.type);
  const Schema = {};
  const options = {};
  attributes.forEach(({ name, ...attribute }) => {
    Schema[name] = attribute;
  });

  if (schema.schema.options?.useTimestamps) {
    options.timestamps = {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    };

    if (schema.schema.options?.softDelete) {
      Schema.deleted_at = Date;
    }
  }

  const MS = new MongoSchema(Schema, options);

  if (schema.schema.options?.indexes) {
    const { indexes } = schema.schema.options;
    if (!Array.isArray(indexes)) {
      throw new Error('Indexes must be an array');
    }
    indexes.forEach(({ $options, ...index }) => {
      MS.index(index, $options);
    });
  }

  return { name: schema.modelName, schema: MS };
}

module.exports = createSchema;
