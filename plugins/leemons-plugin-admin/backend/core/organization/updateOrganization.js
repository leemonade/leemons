/* eslint-disable no-param-reassign */
const { colord } = require('colord');
const compileTokens = require('./compileTokens');
const jsonRaw = require('../../tokens/tokens.json');

const overrideColor = (color, hsl) => {
  color.hue.value = hsl.h.toString();
  color.saturation.value = hsl.s.toString();
  color.lightness.value = hsl.l.toString();
};

async function updateOrganization({ ctx, ...body }) {
  const promises = [
    ctx.tx.call('users.platform.setName', { value: body.name }),
    ctx.tx.call('users.platform.setHostname', { value: body.hostname }),
    ctx.tx.call('users.platform.setHostnameApi', { value: body.hostnameApi }),
    ctx.tx.call('users.platform.setContactName', { value: body.contactName }),
    ctx.tx.call('users.platform.setContactPhone', { value: body.contactPhone }),
    ctx.tx.call('users.platform.setContactEmail', { value: body.contactEmail }),
    ctx.tx.call('users.platform.setAppearanceDarkMode', {
      value: ['true', '1'].includes(String(body.useDarkMode)),
    }),
    ctx.tx.call('users.platform.setPicturesEmptyStates', {
      value: ['true', '1'].includes(String(body.usePicturesEmptyStates)),
    }),
    ctx.tx.call('users.platform.setAppearanceMainColor', { value: body.mainColor }),
    ctx.tx.call('users.platform.setAppearanceMenuMainColor', { value: body.menuMainColor }),
    ctx.tx.call('users.platform.setAppearanceMenuDrawerColor', { value: body.menuDrawerColor }),
    ctx.tx.call('users.platform.setLandscapeLogo', { value: body.logoUrl }),
    ctx.tx.call('users.platform.setSquareLogo', { value: body.squareLogoUrl }),
    ctx.tx.call('users.platform.setEmailLogo', { value: body.emailLogoUrl }),
    ctx.tx.call('users.platform.setEmailWidthLogo', { value: body.emailWidthLogo }),
    ctx.tx.call('users.users.updateEmail', { id: ctx.meta.userSession.id, email: body.email }),
  ];
  if (body.password) {
    promises.push(
      ctx.tx.call('users.users.updatePassword', {
        id: ctx.meta.userSession.id,
        password: body.password,
      })
    );
  }
  const { h, s, l } = colord(body.mainColor).toHsl();
  const { customPrimary } = jsonRaw.core.core.color;
  overrideColor(customPrimary, { h, s, l });
  await compileTokens({ jsonRaw, ctx });
  await Promise.all(promises);
}

module.exports = updateOrganization;
