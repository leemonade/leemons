const testsService = require('../src/services/tests');

async function listTests(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      page: { type: ['number', 'string'] },
      size: { type: ['number', 'string'] },
      published: { type: ['boolean', 'string'] },
    },
    required: ['page', 'size'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.query)) {
    const { page, size, ...options } = ctx.request.query;
    if (options.published === 'true') {
      options.published = true;
    } else if (options.published === 'false') {
      options.published = false;
    }
    const data = await testsService.list(parseInt(page, 10), parseInt(size, 10), {
      ...options,
    });
    ctx.status = 200;
    ctx.body = { status: 200, data };
  } else {
    throw validator.error;
  }
}

async function saveTest(ctx) {
  const test = await testsService.save(ctx.request.body);
  ctx.status = 200;
  ctx.body = { status: 200, test };
}

module.exports = {
  listTests,
  saveTest,
};
