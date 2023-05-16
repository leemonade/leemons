const permissionsService = require('../src/services/permissions');
const centerService = require('../src/services/centers');

async function list(ctx) {
  const permissions = await permissionsService.list();
  ctx.status = 200;
  ctx.body = { status: 200, permissions };
}

async function getPermissionsWithActionsIfIHave(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      permissionNames: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    },
    required: ['permissionNames'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.body)) {
    const permissions = await permissionsService.getUserAgentPermissions(
      ctx.state.userSession.userAgents,
      { query: { permissionName_$in: ctx.request.body.permissionNames } }
    );
    ctx.status = 200;
    ctx.body = { status: 200, permissions };
  } else {
    throw validator.error;
  }
}

module.exports = {
  list,
  getPermissionsWithActionsIfIHave,
};
