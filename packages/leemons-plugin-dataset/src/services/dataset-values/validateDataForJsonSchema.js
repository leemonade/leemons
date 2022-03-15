const _ = require('lodash');

// TODO AÑADIR VALIDADOR CUSTOM PARA NUMEROS DE TELEFONO/ETZ
function validateDataForJsonSchema(jsonSchema, data) {
  const schema = {
    type: 'object',
    additionalProperties: false,
    required: jsonSchema.required,
    properties: {},
  };

  _.forIn(jsonSchema.properties, (p) => {
    delete p.id;
  });

  _.forIn(jsonSchema.properties, (value, key) => {
    if (value.type === 'array') {
      schema.properties[key] = {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          // required: ['value'],
          properties: {
            id: {
              type: 'string',
            },
            searchableValueString: {
              type: 'string',
            },
            value: value.items,
            metadata: {
              type: 'object',
              additionalProperties: true,
            },
          },
        },
      };
    } else {
      schema.properties[key] = {
        type: 'object',
        additionalProperties: false,
        // required: ['value'],
        properties: {
          id: {
            type: 'string',
          },
          searchableValueString: {
            type: 'string',
          },
          value: {
            ...value,
            nullable: true,
          },
        },
      };
    }
  });

  const validator = new global.utils.LeemonsValidator(schema, { strict: false });
  if (!validator.validate(data)) throw validator.error;
}

module.exports = { validateDataForJsonSchema };
