const usersService = require('../services/private/users');

async function login(ctx) {
  try {
    /*
    const leeValidator = leemonUtils.LeemonsValidator();
    schema = {
      type: 'object',
      properties: {
        email: { type: 'email' },
        password: {
          type: 'string',
        },
      },
      required: ['email', 'password'],
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
         */
  } catch (err) {
    ctx.status = 400;
    ctx.body = { status: 400, msg: err.message };
  }
}

async function create(ctx) {
  /*
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

   */
}

async function createSuperAdmin(ctx) {
  /*
  ctx.body = await usersService.registerFirstSuperAdminUser(
    'Pepe',
    'pruebas',
    'testing@test.io',
    'testing'
  );

   */
}

module.exports = {
  login,
  create,
  createSuperAdmin,
};
