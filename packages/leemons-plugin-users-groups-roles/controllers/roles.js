const Ajv = require('ajv');
const rolesService = require('../services/private/roles');

async function create(ctx) {
  try {
    const ajv = new Ajv({ allErrors: true });
    const schema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        permissions: {
          type: 'array',
          items: { type: 'string' },
        },
      },
      required: ['name'],
      additionalProperties: false,
    };
    if (ajv.validate(schema, ctx.request.body)) {
      const role = await rolesService.createRole(
        ctx.request.body.name,
        ctx.request.body.permissions
      );
      ctx.status = 201;
      ctx.body = { status: 201, msg: 'Role created / updated', role };
    } else {
      // Todo añadir funcion a nivel proyecto para la generacion del mensaje de error del ajv
      throw new Error('Error formulario');
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = { status: 400, msg: err.message };
  }
}

async function list(ctx) {
  try {
    const ajv = new Ajv({ allErrors: true });
    const schema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        permissions: {
          type: 'array',
          items: { type: 'string' },
        },
      },
      required: ['name'],
      additionalProperties: false,
    };
    if (ajv.validate(schema, ctx.request.body)) {
      const role = await rolesService.createRole(
        ctx.request.body.name,
        ctx.request.body.permissions
      );
      ctx.status = 201;
      ctx.body = { status: 201, msg: 'Role created / updated', role };
    } else {
      // Todo añadir funcion a nivel proyecto para la generacion del mensaje de error del ajv
      throw new Error('Error formulario');
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = { status: 400, msg: err.message };
  }
}

module.exports = {
  create,
  list,
};
