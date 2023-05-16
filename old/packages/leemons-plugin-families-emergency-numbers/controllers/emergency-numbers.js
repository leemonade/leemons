const _ = require('lodash');

async function getDatasetForm(ctx) {
  const { compileJsonSchema, compileJsonUI } = await leemons
    .getPlugin('dataset')
    .services.dataset.getSchemaWithLocale(
      `families-emergency-numbers-data`,
      'plugins.families-emergency-numbers',
      ctx.state.userSession.locale,
      { userSession: ctx.state.userSession }
    );
  ctx.status = 200;
  ctx.body = { status: 200, jsonSchema: compileJsonSchema, jsonUI: compileJsonUI };
}

module.exports = {
  getDatasetForm,
};
