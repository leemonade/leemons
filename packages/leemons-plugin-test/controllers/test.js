const _ = require('lodash');
const testService = require('../src/services/test');

async function test(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      test: { type: 'string' },
    },
    required: ['test'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.body)) {
    const test = await testService.test(ctx.request.body.test);
    ctx.status = 200;
    ctx.body = { status: 200, test };
  } else {
    throw validator.error;
  }
}

module.exports = {
  test,
};
