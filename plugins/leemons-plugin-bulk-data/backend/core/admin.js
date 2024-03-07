const importAppearanceSettings = require('./bulk/appearance');
const importUsers = require('./bulk/users');

async function initAdmin({ file, ctx }) {
  const users = await importUsers(file, {}, {});
  await ctx.call('admin.settings.registerAdmin', {
    ...users.super,
  });

  await ctx.call('admin.settings.update', {
    status: 'INSTALLED',
    configured: true,
  });

  // Add appearance settings. Compatible with old format bulk-data documents.
  try {
    const appearanceSettings = await importAppearanceSettings(file);
    const promises = [];
    Object.keys(appearanceSettings).forEach((key) => {
      const settings = appearanceSettings[key];
      promises.push(
        ctx.call('admin.organization.updatePrimaryColorAndCompileTokens', {
          primaryColor: settings.mainColor,
        })
      );
      promises.push(
        ctx.call('users.platform.setAppearanceDarkMode', {
          value: settings.useDarkMode,
        })
      );
      promises.push(
        ctx.call('users.platform.setPicturesEmptyStates', {
          value: settings.usePicturesEmptyStates,
        })
      );
      promises.push(
        ctx.call('users.platform.setAppearanceMainColor', { value: settings.mainColor })
      );
      promises.push(
        ctx.call('users.platform.setAppearanceMenuMainColor', { value: settings.menuMainColor })
      );
      promises.push(
        ctx.call('users.platform.setAppearanceMenuDrawerColor', { value: settings.menuDrawerColor })
      );

      if (settings.logoUrl)
        promises.push(ctx.call('users.platform.setLandscapeLogo', { value: settings.logoUrl }));
      if (settings.squareLogoUrl)
        promises.push(ctx.call('users.platform.setSquareLogo', { value: settings.squareLogoUrl }));
      if (settings.emailLogoUrl)
        promises.push(ctx.call('users.platform.setEmailLogo', { value: settings.emailLogoUrl }));
      if (settings.emailWidthLogo)
        promises.push(
          ctx.call('users.platform.setEmailWidthLogo', { value: settings.emailWidthLogo })
        );
    });
    await Promise.all(promises);
  } catch (error) {
    ctx.logger.error('No appearance settings passed/loaded:', error);
  }
}

module.exports = initAdmin;
