const got = require('got');
const { LeemonsError } = require('@leemons/error');

const { createTempFile } = require('../helpers/createTempFile');
const { importBulkData } = require('./importBulkData');

async function loadFromTemplateURL({ templateURL, ctx }) {
  const file = await createTempFile({
    readStream: got(templateURL, { isStream: true }),
  });

  const config = {};

  const { items: centers } = await ctx.tx.call('users.centers.list', {
    page: 0,
    size: 9999,
  });
  config.centers = { centerA: centers[0] };

  const { items: profilesData } = await ctx.call('users.profiles.list', {
    page: 0,
    size: 9999,
  });

  config.profiles = profilesData.map((profile) => ({ [profile.sysName]: profile.id }));
  config.users = { admin: { ...ctx.meta.userSession } };

  try {
    await importBulkData({ docPath: file.path, config, ctx });
  } catch (error) {
    throw new LeemonsError(ctx, {
      message: `Something went wrong importing from template URL: ${error}`,
      httpStatusCode: 500,
    });
  }
}

module.exports = { loadFromTemplateURL };
