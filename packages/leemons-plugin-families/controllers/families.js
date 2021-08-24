const _ = require('lodash');

const usersService = require('../src/services/users');

async function searchUsers(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      profileType: { type: 'string', enum: ['student', 'guardian'] },
      query: {
        type: 'object',
        additionalProperties: true,
      },
    },
    required: ['profileType'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.body)) {
    const users = await usersService.searchUsers(
      ctx.request.body.profileType,
      ctx.request.body.query
    );
    ctx.status = 200;
    ctx.body = { status: 200, users };
  } else {
    throw validator.error;
  }
}

async function getDatasetForm(ctx) {
  const { compileJsonSchema, compileJsonUI } = await leemons
    .getPlugin('dataset')
    .services.dataset.getSchemaWithLocale(
      `families-data`,
      'plugins.families',
      ctx.state.userSession.locale,
      { userSession: ctx.state.userSession }
    );
  ctx.status = 200;
  ctx.body = { status: 200, jsonSchema: compileJsonSchema, jsonUI: compileJsonUI };
}

module.exports = {
  searchUsers,
  getDatasetForm,
};
