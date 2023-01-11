const _ = require('lodash');
const documentService = require('../src/services/document');

async function saveDocument(ctx) {
  const data = JSON.parse(ctx.request.body.data);
  _.forIn(ctx.request.files, (value, key) => {
    _.set(data, key, value);
  });
  const document = await documentService.saveDocument(data, {
    userSession: ctx.state.userSession,
  });
  ctx.status = 200;
  ctx.body = { status: 200, document };
}

async function getDocument(ctx) {
  const document = await documentService.getDocument(ctx.request.params.id, {
    userSession: ctx.state.userSession,
  });
  ctx.status = 200;
  ctx.body = { status: 200, document };
}
async function deleteDocument(ctx) {
  const document = await documentService.deleteDocument(ctx.request.params.id, {
    userSession: ctx.state.userSession,
  });
  ctx.status = 200;
  ctx.body = { status: 200, document };
}

async function duplicateDocument(ctx) {
  const document = await documentService.duplicateDocument(ctx.request.body.id, {
    published: ctx.request.body.published,
    userSession: ctx.state.userSession,
  });
  ctx.status = 200;
  ctx.body = { status: 200, document };
}

module.exports = {
  saveDocument,
  getDocument,
  deleteDocument,
  duplicateDocument,
};
