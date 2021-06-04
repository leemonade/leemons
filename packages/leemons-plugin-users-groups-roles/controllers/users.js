const Ajv = require('ajv');
const permissionService = require('../services/private/permissions');

const table = {
  user: leemons.query('plugins_users-groups-roles::users'),
};

async function create(ctx) {
  const ajv = new Ajv({ allErrors: true });
  const schema = {
    type: 'object',
    properties: {
      name: { type: 'string' },
      test: { type: 'string' },
    },
    required: ['name', 'test'],
    additionalProperties: false,
  };
  if (ajv.validate(schema, ctx.request.body)) {
  } else {
    console.log('error', ajv.errors);
  }
  ctx.body = { test: 'Holaaa' };
  return ctx.body;
}

module.exports = {
  create,
};
