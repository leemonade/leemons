const got = require('got');
const { LeemonsError } = require('@leemons/error');

const { createTempFile } = require('../helpers/createTempFile');
const { importBulkData } = require('./importBulkData');

async function loadFromTemplateURL({ templateURL, ctx }) {
  const file = await createTempFile({
    readStream: got(templateURL, { isStream: true }),
  });

  const config = {};

  const { items: centers } = await ctx.tx.call('users.centers.listRest');
  config.centers = { centerA: centers[0].id };

  const { items: profilesData } = await ctx.call('users.profiles.list', {
    page: 0,
    size: 9999,
  });

  config.profiles = profilesData.map((profile) => ({ [profile.sysName]: profile.id }));

  // // 3. Pillamos los usuarios:
  // const users = await ctx.tx.call('users.users.listRest');
  // const adminUser = users.find((user) => user.profile === config.profiles.admin);
  // config.users = { admin: adminUser.id };

  try {
    await importBulkData({ docPath: file.path, config: {}, ctx });
  } catch (error) {
    throw new LeemonsError(ctx, {
      message: `Something went wrong importing from template URL: ${error}`,
      httpStatusCode: 500,
    });
  } finally {
    await file.remove();
  }
}

module.exports = { loadFromTemplateURL };
