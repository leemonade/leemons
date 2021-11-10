const groupService = require('../src/services/groups');

async function postGroup(ctx) {
  const group = await groupService.addGroup(ctx.request.body);
  ctx.status = 200;
  ctx.body = { status: 200, group };
}

async function putGroup(ctx) {
  const group = await groupService.updateGroup(ctx.request.body);
  ctx.status = 200;
  ctx.body = { status: 200, group };
}

async function listGroup(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      page: { type: ['number', 'string'] },
      size: { type: ['number', 'string'] },
      program: { type: 'string' },
    },
    required: ['page', 'size', 'program'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.query)) {
    const { page, size, program, ...options } = ctx.request.query;
    const data = await groupService.listGroups(parseInt(page, 10), parseInt(size, 10), program, {
      ...options,
    });
    ctx.status = 200;
    ctx.body = { status: 200, data };
  } else {
    throw validator.error;
  }
}

module.exports = {
  postGroup,
  listGroup,
  putGroup,
};
