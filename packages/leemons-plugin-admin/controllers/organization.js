const organizationService = require('../src/services/organization');

async function get(ctx) {
  try {
    const organization = await organizationService.getOrganization({
      userSession: ctx.state.userSession,
    });
    ctx.status = 200;
    ctx.body = {
      status: 200,
      organization,
    };
  } catch (e) {
    console.error(e);
    ctx.status = 400;
    ctx.body = { status: 400, error: e.message };
  }
}

async function post(ctx) {
  try {
    await organizationService.updateOrganization(ctx.request.body, {
      userSession: ctx.state.userSession,
    });
    ctx.status = 200;
    ctx.body = {
      status: 200,
    };
  } catch (e) {
    console.error(e);
    ctx.status = 400;
    ctx.body = { status: 400, error: e.message };
  }
}

async function getJsonTheme(ctx) {
  try {
    const jsonTheme = await organizationService.getJsonTheme();
    ctx.status = 200;
    ctx.body = {
      status: 200,
      jsonTheme,
    };
  } catch (e) {
    console.error(e);
    ctx.status = 400;
    ctx.body = { status: 400, error: e.message };
  }
}

module.exports = {
  get,
  post,
  getJsonTheme,
};
