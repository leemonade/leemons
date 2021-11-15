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
  let { nodeTypes } = ctx.request.query;
  if (typeof nodeTypes === 'string') {
    nodeTypes = ctx.request.query.nodeTypes
      .replace('[', '')
      .replace(']', '')
      .replaceAll("'", '')
      .replaceAll('"', '')
      .replaceAll(' ', '')
      .split(',');
  }
  const tree = await commonService.getTree(nodeTypes);
  ctx.status = 200;
  ctx.body = { status: 200, tree };
}

async function geClassesUnderNodeTree(ctx) {
  let { nodeTypes } = ctx.request.query;
  if (typeof nodeTypes === 'string') {
    nodeTypes = ctx.request.query.nodeTypes
      .replace('[', '')
      .replace(']', '')
      .replaceAll("'", '')
      .replaceAll('"', '')
      .replaceAll(' ', '')
      .split(',');
  }
  const classes = await commonService.geClassesUnderNodeTree(
    nodeTypes,
    ctx.request.query.nodeType,
    ctx.request.query.nodeId
  );
  ctx.status = 200;
  ctx.body = { status: 200, classes };
}

module.exports = {
  geClassesUnderNodeTree,
  listClassSubjects,
  getTree,
};
