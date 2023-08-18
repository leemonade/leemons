/* eslint-disable no-unreachable */
const scormService = require('../src/services/package');
const { supportedVersions } = require('../config/constants');

async function savePackage(ctx) {
  const data = ctx.request.body;
  const { userSession } = ctx.state;

  const scorm = await scormService.savePackage(data, { userSession });

  ctx.status = 200;
  ctx.body = { status: 200, package: scorm };
}

async function getPackage(ctx) {
  const { id } = ctx.params;
  const { userSession } = ctx.state;

  const scorm = await scormService.getPackage(id, { userSession });

  ctx.status = 200;
  ctx.body = { status: 200, scorm };
}
async function deletePackage(ctx) {
  const { id } = ctx.params;
  const { userSession } = ctx.state;

  const scorm = await scormService.deletePackage(id, { userSession });

  ctx.status = 200;
  ctx.body = { status: 200, scorm };
}

async function duplicatePackage(ctx) {
  const { id, published } = ctx.request.body;
  const { userSession } = ctx.state;

  const scorm = await scormService.duplicatePackage(id, {
    published,
    userSession,
  });

  ctx.status = 200;
  ctx.body = { status: 200, scorm };
}

async function assignPackage(ctx) {
  const data = ctx.request.body;
  const { userSession } = ctx.state;

  const scorm = await scormService.assignPackage(data, {
    userSession,
    ctx,
  });

  ctx.status = 200;
  ctx.body = { status: 200, scorm };
}

async function sharePackage(ctx) {
  const { assignableId, canAccess } = ctx.request.body;
  const { userSession } = ctx.state;

  const permissions = await scormService.sharePackage(assignableId, { canAccess }, { userSession });

  ctx.status = 200;
  ctx.body = { status: 200, permissions };
}

async function getSupportedVersions(ctx) {
  ctx.status = 200;
  ctx.body = { status: 200, versions: Object.values(supportedVersions) };
}

module.exports = {
  getPackage,
  savePackage,
  sharePackage,
  deletePackage,
  assignPackage,
  duplicatePackage,
  getSupportedVersions,
};
