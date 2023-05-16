const _ = require('lodash');
const schemaService = require('../src/services/dataset-schema');
const schemaLocaleService = require('../src/services/dataset-schema-locale');
const { translations } = require('../src/services/translations');

const schemaConfig = {
  type: 'object',
  properties: {
    schema: {
      type: 'object',
      additionalProperties: true,
    },
    ui: {
      type: 'object',
      additionalProperties: true,
    },
  },
  required: ['schema', 'ui'],
};

async function getSchema(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      locationName: { type: 'string' },
      pluginName: { type: 'string' },
    },
    required: ['locationName', 'pluginName'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.body)) {
    const dataset = await schemaService.getSchema(
      ctx.request.body.locationName,
      ctx.request.body.pluginName
    );
    ctx.status = 200;
    ctx.body = { status: 200, dataset };
  } else {
    throw validator.error;
  }
}

async function getSchemaLocale(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      locationName: { type: 'string' },
      pluginName: { type: 'string' },
      locale: { type: 'string' },
    },
    required: ['locationName', 'pluginName'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.body)) {
    let { locale } = ctx.request.body;
    if (!locale) locale = await leemons.getPlugin('users').services.platform.getDefaultLocale();
    // TODO Esto es "inseguro" ya que se le esta pasando el calledFrom
    const dataset = await schemaService.getSchemaWithLocale.call(
      { calledFrom: ctx.request.body.pluginName },
      ctx.request.body.locationName,
      ctx.request.body.pluginName,
      locale
    );
    ctx.status = 200;
    ctx.body = {
      status: 200,
      dataset,
    };
  } else {
    throw validator.error;
  }
}

async function getSchemaFieldLocale(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      locationName: { type: 'string' },
      pluginName: { type: 'string' },
      locale: { type: 'string' },
      item: { type: 'string' },
    },
    required: ['locationName', 'pluginName', 'locale', 'item'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.body)) {
    // TODO Esto es "inseguro" ya que se le esta pasando el calledFrom
    const { compileJsonSchema, compileJsonUI } = await schemaService.getSchemaWithLocale.call(
      { calledFrom: ctx.request.body.pluginName },
      ctx.request.body.locationName,
      ctx.request.body.pluginName,
      ctx.request.body.locale,
      { defaultWithEmptyValues: true }
    );
    ctx.status = 200;
    ctx.body = {
      status: 200,
      schema: compileJsonSchema.properties[ctx.request.body.item],
      ui: compileJsonUI[ctx.request.body.item],
    };
  } else {
    throw validator.error;
  }
}

async function saveField(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      locationName: { type: 'string' },
      pluginName: { type: 'string' },
      schemaConfig,
      schemaLocales: {
        type: 'object',
        patternProperties: {
          [translations().functions.localeRegexString]: schemaConfig,
        },
      },
      options: {
        type: 'object',
        properties: {
          useDefaultLocaleCallback: { type: 'boolean' },
        },
        additionalProperties: false,
      },
    },
    required: ['locationName', 'pluginName', 'schemaConfig', 'schemaLocales'],
    additionalProperties: false,
  });

  if (validator.validate(ctx.request.body)) {
    const dataset = await schemaService.saveField(
      ctx.request.body.locationName,
      ctx.request.body.pluginName,
      ctx.request.body.schemaConfig,
      ctx.request.body.schemaLocales,
      ctx.request.body.options
    );
    ctx.status = 200;
    ctx.body = { status: 200, dataset };
  } else {
    throw validator.error;
  }
}

async function saveMultipleFields(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      locationName: { type: 'string' },
      pluginName: { type: 'string' },
      fields: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            schemaConfig,
            schemaLocales: {
              type: 'object',
              patternProperties: {
                [translations().functions.localeRegexString]: schemaConfig,
              },
            },
          },
          required: ['schemaConfig', 'schemaLocales'],
        },
      },
    },
    required: ['locationName', 'pluginName', 'fields'],
    additionalProperties: false,
  });

  if (validator.validate(ctx.request.body)) {
    const dataset = await schemaService.saveMultipleFields(
      ctx.request.body.locationName,
      ctx.request.body.pluginName,
      ctx.request.body.fields
    );
    ctx.status = 200;
    ctx.body = { status: 200, dataset };
  } else {
    throw validator.error;
  }
}

async function removeField(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      locationName: { type: 'string' },
      pluginName: { type: 'string' },
      item: { type: 'string' },
    },
    required: ['locationName', 'pluginName', 'item'],
    additionalProperties: false,
  });

  if (validator.validate(ctx.request.body)) {
    const dataset = await schemaService.removeField(
      ctx.request.body.locationName,
      ctx.request.body.pluginName,
      ctx.request.body.item
    );
    ctx.status = 200;
    ctx.body = { status: 200, dataset };
  } else {
    throw validator.error;
  }
}

module.exports = {
  getSchema,
  saveField,
  saveMultipleFields,
  removeField,
  getSchemaFieldLocale,
  getSchemaLocale,
};
