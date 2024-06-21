const got = require('got');
const { LeemonsError } = require('@leemons/error');

const { createTempFile } = require('../helpers/createTempFile');
const { importBulkData } = require('./importBulkData');

async function setAdminUsers(profiles, ctx) {
  const deployment = await ctx.call('deployment-manager.getDeployment');

  if (deployment.type === 'free') {
    return {
      admin: {
        ...ctx.meta.userSession,
      },
    };
  }

  if (deployment.type === 'basic') {
    const adminAgents = await ctx.call('users.users.searchUserAgents', {
      profile: profiles.admin.id,
      user: ctx.meta.userSession.id,
    });

    return {
      admin: {
        ...ctx.meta.userSession,
        userAgents: adminAgents.map(({ id, role }) => ({ id, role })),
      },
      super: {
        ...ctx.meta.userSession,
      },
    };
  }
  return null;
}

async function initializeForClientManager({ ctx }) {
  const { items: centersData } = await ctx.tx.call('users.centers.list', {
    page: 0,
    size: 9999,
  });
  const centers = { centerA: centersData[0] };

  const { items: profilesData } = await ctx.call('users.profiles.list', {
    page: 0,
    size: 9999,
  });
  const { profiles: userAdministrativeProfiles } = await ctx.call('users.users.profilesRest', {
    user: ctx.meta.userSession.id,
  });
  const allProfiles = [...profilesData, ...userAdministrativeProfiles];
  const uniqueProfiles = allProfiles.reduce((acc, profile) => {
    if (!acc[profile.sysName]) {
      acc[profile.sysName] = profile;
    }
    return acc;
  }, {});
  const profiles = uniqueProfiles;

  const users = await setAdminUsers(uniqueProfiles, ctx);

  return { centers, users, profiles };
}

async function loadFromTemplateURL({
  templateURL,
  shareLibraryAssetsWithTeacherProfile,
  shouldInitializeForClientManager = true,
  onFinishData = {},
  ctx,
}) {
  if (!templateURL) {
    throw new LeemonsError(ctx, {
      message: 'Template URL is required',
      httpStatusCode: 400,
    });
  }

  let file = null;
  try {
    file = await createTempFile({
      readStream: got(templateURL, { isStream: true }),
    });
  } catch (error) {
    throw new LeemonsError(ctx, {
      message: `Could not download template from URL: ${error}`,
      httpStatusCode: 500,
    });
  }

  let preConfig = null;
  if (shouldInitializeForClientManager) {
    preConfig = await initializeForClientManager({ ctx });
  }

  try {
    await importBulkData({
      docPath: file.path,
      preConfig,
      shareLibraryAssetsWithTeacherProfile,
      onFinishData,
      ctx,
    });
    return { status: 200 };
  } catch (error) {
    console.error('Error importing bulk-data', error);
    throw new LeemonsError(ctx, {
      message: `Something went wrong importing from template URL: ${error}`,
      httpStatusCode: 500,
      cause: error,
    });
  }
}

module.exports = { loadFromTemplateURL };
