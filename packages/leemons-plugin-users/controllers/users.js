const _ = require('lodash');
const usersService = require('../src/services/users');
const userAgentsService = require('../src/services/user-agents');
const { table } = require('../src/services/tables');
const { hasPermissionCTX, userAgentsAreContacts } = require('../services/users');

async function canReset(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      token: { type: 'string' },
    },
    required: ['token'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.body)) {
    const can = await usersService.canReset(ctx.request.body.token);
    ctx.status = 200;
    ctx.body = { status: 200, can };
  } else {
    throw validator.error;
  }
}

async function canRegisterPassword(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      token: { type: 'string' },
    },
    required: ['token'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.body)) {
    const can = await usersService.canRegisterPassword(ctx.request.body.token);
    ctx.status = 200;
    ctx.body = { status: 200, can };
  } else {
    throw validator.error;
  }
}

async function reset(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      token: { type: 'string' },
      password: { type: 'string' },
    },
    required: ['token', 'password'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.body)) {
    const user = await usersService.reset(ctx.request.body.token, ctx.request.body.password, ctx);
    ctx.status = 200;
    ctx.body = { status: 200, user };
  } else {
    throw validator.error;
  }
}

async function registerPassword(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      token: { type: 'string' },
      password: { type: 'string' },
    },
    required: ['token', 'password'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.body)) {
    const user = await usersService.registerPassword(
      ctx.request.body.token,
      ctx.request.body.password
    );
    ctx.status = 200;
    ctx.body = { status: 200, user };
  } else {
    throw validator.error;
  }
}

async function recover(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
    },
    required: ['email'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.body)) {
    try {
      await usersService.recover(ctx.request.body.email, ctx);
      ctx.status = 200;
      ctx.body = { status: 200, message: 'Email sent' };
    } catch (e) {
      console.error(e);
      // Always send 200 so hackers can't know if the email exists
      ctx.status = 200;
      ctx.body = { status: 200, code: e.code, message: 'Email sent' };
    }
  } else {
    throw validator.error;
  }
}

async function login(ctx) {
  const validator = new global.utils.LeemonsValidator({
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
      password: {
        type: 'string',
      },
    },
    required: ['email', 'password'],
    additionalProperties: false,
  });
  if (validator.validate(ctx.request.body)) {
    const data = await usersService.login(ctx.request.body.email, ctx.request.body.password);
    ctx.status = 200;
    ctx.body = { status: 200, user: data.user, jwtToken: data.token };
  } else {
    throw validator.error;
  }
}

async function detail(ctx) {
  const user = await usersService.detail(ctx.state.userSession.id);
  ctx.status = 200;
  ctx.body = { status: 200, user };
}

async function detailForPage(ctx) {
  const allowedPermissions = {
    'plugins.users.users': {
      actions: ['view', 'update', 'create', 'delete', 'admin'],
    },
  };
  let hasPermission = ctx.params.id === ctx.state.userSession.id;

  if (!hasPermission) {
    hasPermission = await hasPermissionCTX(ctx.state.userSession, allowedPermissions);
  }

  const data = await usersService.detailForPage(ctx.params.id, {
    userSession: ctx.state.userSession,
  });

  // Comprobamos si se tienen como contactos
  if (!hasPermission) {
    hasPermission = await userAgentsAreContacts(
      _.map(ctx.state.userSession.userAgents, 'id'),
      _.map(data.userAgents, 'id')
    );
  }

  if (hasPermission) {
    ctx.status = 200;
    ctx.body = { status: 200, data };
  } else {
    const rAllowedPermissions = [];
    _.forIn(allowedPermissions, ({ actions }, permissionName) => {
      rAllowedPermissions.push({ permissionName, actions });
    });
    ctx.status = 401;
    ctx.body = {
      status: 401,
      message: 'You do not have permissions',
      allowedPermissions: rAllowedPermissions,
    };
  }
}

async function agentDetailForPage(ctx) {
  const allowedPermissions = {
    'plugins.users.users': {
      actions: ['view', 'update', 'create', 'delete', 'admin'],
    },
  };
  let hasPermission = ctx.params.id === ctx.state.userSession.id;

  if (!hasPermission) {
    hasPermission = await hasPermissionCTX(ctx.state.userSession, allowedPermissions);
  }

  // Comprobamos si se tienen como contactos
  if (!hasPermission) {
    hasPermission = await userAgentsAreContacts(
      _.map(ctx.state.userSession.userAgents, 'id'),
      ctx.params.id
    );
  }

  if (hasPermission) {
    const data = await userAgentsService.agentDetailForPage(ctx.params.id, {
      userSession: ctx.state.userSession,
    });
    ctx.status = 200;
    ctx.body = { status: 200, data };
  } else {
    const rAllowedPermissions = [];
    _.forIn(allowedPermissions, ({ actions }, permissionName) => {
      rAllowedPermissions.push({ permissionName, actions });
    });
    ctx.status = 401;
    ctx.body = {
      status: 401,
      message: 'You do not have permissions',
      allowedPermissions: rAllowedPermissions,
    };
  }
}

async function _profiles(ctx) {
  const profiles = await usersService.profiles(ctx.state.userSession.id);
  ctx.status = 200;
  ctx.body = { status: 200, profiles };
}

async function _centers(ctx) {
  const centers = await usersService.centers(ctx.state.userSession.id);
  ctx.status = 200;
  ctx.body = { status: 200, centers };
}

async function profileToken(ctx) {
  const jwtToken = await usersService.profileToken(ctx.state.userSession.id, ctx.params.id);
  ctx.status = 200;
  ctx.body = { status: 200, jwtToken };
}

async function centerProfileToken(ctx) {
  const jwtToken = await usersService.centerProfileToken(
    ctx.state.userSession.id,
    ctx.params.centerId,
    ctx.params.profileId
  );
  ctx.status = 200;
  ctx.body = { status: 200, jwtToken };
}

async function setRememberLogin(ctx) {
  const centers = await usersService.centers(ctx.state.userSession.id);
  const centerI = _.findIndex(centers, { id: ctx.request.body.center });
  if (centerI >= 0) {
    const profileI = _.findIndex(centers[centerI].profiles, { id: ctx.request.body.profile });
    if (profileI >= 0) {
      await table.userRememberLogin.set(
        { user: ctx.state.userSession.id },
        {
          user: ctx.state.userSession.id,
          profile: ctx.request.body.profile,
          center: ctx.request.body.center,
        }
      );

      ctx.status = 200;
      ctx.body = {
        status: 200,
        profile: centers[centerI].profiles[profileI],
        center: centers[centerI],
      };
    } else {
      throw new Error('You do not have access to the specified profile');
    }
  } else {
    throw new Error('You do not have access to the specified center');
  }
}

async function removeRememberLogin(ctx) {
  const remember = await table.userRememberLogin.findOne({ user: ctx.state.userSession.id });

  if (remember) {
    await table.userRememberLogin.delete({ user: ctx.state.userSession.id });
  }

  ctx.status = 200;
  ctx.body = {
    status: 200,
  };
}

async function getRememberLogin(ctx) {
  const remember = await table.userRememberLogin.findOne({ user: ctx.state.userSession.id });
  if (remember) {
    const centers = await usersService.centers(ctx.state.userSession.id);
    const centerI = _.findIndex(centers, { id: remember.center });
    if (centerI >= 0) {
      const profileI = _.findIndex(centers[centerI].profiles, { id: remember.profile });
      if (profileI >= 0) {
        ctx.status = 200;
        ctx.body = {
          status: 200,
          profile: centers[centerI].profiles[profileI],
          center: centers[centerI],
        };
      } else {
        ctx.status = 200;
        ctx.body = { status: 200, profile: null, center: null };
      }
    } else {
      ctx.status = 200;
      ctx.body = { status: 200, profile: null, center: null };
    }
  } else {
    ctx.status = 200;
    ctx.body = { status: 200, profile: null, center: null };
  }
}

async function createBulk(ctx) {
  const users = await usersService.addBulk(ctx.request.body, ctx, {
    userSession: ctx.state.userSession,
  });
  ctx.status = 200;
  ctx.body = { status: 200, users };
}

async function deleteUserAgent(ctx) {
  await userAgentsService.deleteById(ctx.params.id, { soft: true });
  ctx.status = 200;
  ctx.body = { status: 200 };
}

async function list(ctx) {
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
    const data = await usersService.list(
      ctx.request.body.page,
      ctx.request.body.size,
      ctx.request.body.query
    );
    ctx.status = 200;
    ctx.body = { status: 200, data };
  } else {
    throw validator.error;
  }
}

async function getUserAgentsInfo(ctx) {
  const userAgents = await userAgentsService.getUserAgentsInfo(
    ctx.request.body.ids,
    ctx.request.body.options
  );
  ctx.status = 200;
  ctx.body = { status: 200, userAgents };
}

async function searchUserAgents(ctx) {
  const userAgents = await userAgentsService.searchUserAgents(ctx.request.body.filters, {
    ...ctx.request.body.options,
    userSession: ctx.state.userSession,
  });
  ctx.status = 200;
  ctx.body = { status: 200, userAgents };
}

async function contacts(ctx) {
  const userAgents = await userAgentsService.contacts.getUserAgentContacts(
    _.map(ctx.state.userSession.userAgents, 'id'),
    { ...ctx.request.body, returnAgent: true }
  );
  ctx.status = 200;
  ctx.body = { status: 200, userAgents: _.flatten(userAgents) };
}

async function createSuperAdmin(ctx) {
  // TODO Borrar en produccion
  ctx.body = await usersService.addFirstSuperAdminUser(
    'Jaime',
    'Gómez Cimarro',
    'jaime@leemons.io',
    'testing',
    'es-ES'
  );
}

async function getDataForUserAgentDatasets(ctx) {
  const data = await userAgentsService.getDataForUserAgentDatasets(ctx.state.userSession);
  ctx.status = 200;
  ctx.body = { status: 200, data };
}

async function saveDataForUserAgentDatasets(ctx) {
  const data = await userAgentsService.saveDataForUserAgentDatasets(
    ctx.state.userSession,
    ctx.request.body
  );
  ctx.status = 200;
  ctx.body = { status: 200, data };
}

async function updateUser(ctx) {
  const allowedPermissions = {
    'plugins.users.users': {
      actions: ['update', 'admin'],
    },
  };
  let hasPermission = ctx.params.id === ctx.state.userSession.id;

  if (!hasPermission) {
    hasPermission = await hasPermissionCTX(ctx.state.userSession, allowedPermissions);
  }

  if (hasPermission) {
    const data = await usersService.update(ctx.params.id, ctx.request.body, {
      userSession: ctx.state.userSession,
    });
    ctx.status = 200;
    ctx.body = { status: 200, data };
  } else {
    const rAllowedPermissions = [];
    _.forIn(allowedPermissions, ({ actions }, permissionName) => {
      rAllowedPermissions.push({ permissionName, actions });
    });
    ctx.status = 401;
    ctx.body = {
      status: 401,
      message: 'You do not have permissions',
      allowedPermissions: rAllowedPermissions,
    };
  }
}

async function updateUserAvatar(ctx) {
  const allowedPermissions = {
    'plugins.users.users': {
      actions: ['update', 'admin'],
    },
  };
  let hasPermission = ctx.params.id === ctx.state.userSession.id;

  if (!hasPermission) {
    hasPermission = await hasPermissionCTX(ctx.state.userSession, allowedPermissions);
  }

  if (hasPermission) {
    const data = await usersService.updateAvatar(ctx.params.id, ctx.request.files.image);
    ctx.status = 200;
    ctx.body = { status: 200, data };
  } else {
    const rAllowedPermissions = [];
    _.forIn(allowedPermissions, ({ actions }, permissionName) => {
      rAllowedPermissions.push({ permissionName, actions });
    });
    ctx.status = 401;
    ctx.body = {
      status: 401,
      message: 'You do not have permissions',
      allowedPermissions: rAllowedPermissions,
    };
  }
}

async function updateUserAgent(ctx) {
  const allowedPermissions = {
    'plugins.users.users': {
      actions: ['update', 'admin'],
    },
  };
  let hasPermission = ctx.params.id === ctx.state.userSession.id;

  if (!hasPermission) {
    hasPermission = await hasPermissionCTX(ctx.state.userSession, allowedPermissions);
  }

  if (hasPermission) {
    const data = await userAgentsService.update(ctx.params.id, ctx.request.body);
    ctx.status = 200;
    ctx.body = { status: 200, data };
  } else {
    const rAllowedPermissions = [];
    _.forIn(allowedPermissions, ({ actions }, permissionName) => {
      rAllowedPermissions.push({ permissionName, actions });
    });
    ctx.status = 401;
    ctx.body = {
      status: 401,
      message: 'You do not have permissions',
      allowedPermissions: rAllowedPermissions,
    };
  }
}

async function updateSessionConfig(ctx) {
  const data = await usersService.updateSessionConfig(ctx);
  ctx.status = 200;
  ctx.body = { status: 200, data };
}

async function activateUser(ctx) {
  const user = await usersService.activateUser(ctx.request.body.id, ctx.request.body.password);
  ctx.status = 200;
  ctx.body = { status: 200, user };
}

async function sendWelcomeEmailToUser(ctx) {
  try {
    const email = await usersService.sendWelcomeEmailToUser(ctx.request.body.user, ctx);
    ctx.status = 200;
    ctx.body = { status: 200, email };
  } catch (e) {
    ctx.status = 200;
    ctx.body = { status: 200, code: e.code, message: 'Email sent' };
  }
}

module.exports = {
  list,
  reset,
  login,
  detail,
  recover,
  contacts,
  canReset,
  profiles: _profiles,
  centers: _centers,
  updateUser,
  createBulk,
  activateUser,
  profileToken,
  detailForPage,
  updateUserAgent,
  searchUserAgents,
  createSuperAdmin,
  registerPassword,
  getUserAgentsInfo,
  agentDetailForPage,
  setRememberLogin,
  updateSessionConfig,
  getRememberLogin,
  removeRememberLogin,
  centerProfileToken,
  updateUserAvatar,
  deleteUserAgent,
  canRegisterPassword,
  sendWelcomeEmailToUser,
  getDataForUserAgentDatasets,
  saveDataForUserAgentDatasets,
};
