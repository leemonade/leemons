/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { LeemonsValidator } = require('@leemons/validator');

// TODO ADD CUSTOM VALIDATOR FOR PHONE NUMBERS/ETZ

/**
 * Validate data for a JSON Schema.
 *
 * @param {object} jsonSchema - The JSON Schema to validate the data against.
 * @param {object} data - The data to validate.
 * @param {string[]} allowedRequiredKeys - Filter the required keys.
 */
function validateDataForJsonSchema({ jsonSchema, data, allowedRequiredKeys }) {
  let { required = [] } = jsonSchema;

  if (Array.isArray(allowedRequiredKeys)) {
    required = required.filter((key) => allowedRequiredKeys.includes(key));
  }

  const schema = {
    type: 'object',
    additionalProperties: false,
    required,
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

  // When an Admin removes a field from the dataset, the editing permissions for that field are not removed for users.
  // This results in the field having an undefined value, causing the JSON Schema validator to fail.
  // Therefore, we ensure the field is not in the dataset and does not have an undefined value.
  _.forIn(data, (value, key) => {
    if (!jsonSchema.properties[key] && !data[key]) {
      delete data[key];
    }
  });

  const validator = new LeemonsValidator(schema, { strict: false });
  if (!validator.validate(data)) throw validator.error;
}

module.exports = { validateDataForJsonSchema };
