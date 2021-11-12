const commonService = require('../src/services/common');

async function listClassSubjects(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      program: { type: 'string' },
      course: { type: 'string' },
      group: { type: 'string' },
    },
    required: ['program'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.query)) {
    const { program, course, group, ...options } = ctx.request.query;
    const { classes, subjects } = await commonService.listClassesSubjects(
      { program, course, group },
      {
        ...options,
      }
    );
    ctx.status = 200;
    ctx.body = { status: 200, classes, subjects };
  } else {
    throw validator.error;
  }
}

async function getTree(ctx) {
  const tree = await commonService.getTree();
  ctx.status = 200;
  ctx.body = { status: 200, tree };
}

module.exports = {
  listClassSubjects,
  getTree,
};
