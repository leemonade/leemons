const { listTags } = require('./listTags');

function getControllerFunctions(pluginName) {
  // Si no hay pluginName devolvemos error
  if (!pluginName) {
    throw new Error('getControllerFunctions: No se ha especificado el nombre del plugin');
  }

  async function _listTags(ctx) {
    const validator = new global.utils.LeemonsValidator({
      type: 'object',
      properties: {
        page: { type: 'number' },
        size: { type: 'number' },
        query: { type: 'object', additionalProperties: true },
      },
      required: ['page', 'size'],
      additionalProperties: false,
    });
    if (validator.validate(ctx.request.body)) {
      const { page, size, query } = ctx.request.body;
      const data = await listTags(page, size, { query });
      ctx.status = 200;
      ctx.body = { status: 200, data };
    } else {
      throw validator.error;
    }
  }

  return {
    listTags: _listTags,
  };
}

module.exports = { getControllerFunctions };
