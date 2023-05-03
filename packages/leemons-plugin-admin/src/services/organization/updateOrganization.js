/* eslint-disable no-param-reassign */
const { colord } = require('colord');
const compileTokens = require('./compileTokens');
const jsonRaw = require('../../tokens/tokens.json');

const overrideColor = (color, hsl) => {
  color.hue.value = hsl.h.toString();
  color.saturation.value = hsl.s.toString();
  color.lightness.value = hsl.l.toString();
};

async function updateOrganization(body, { userSession }) {
  const { platform, users } = leemons.getPlugin('users').services;
  const promises = [
    platform.setName(body.name),
    platform.setHostname(body.hostname),
    platform.setHostnameApi(body.hostnameApi),
    platform.setContactName(body.contactName),
    platform.setContactPhone(body.contactPhone),
    platform.setContactEmail(body.contactEmail),
    platform.setAppearanceDarkMode(['true', '1'].includes(String(body.useDarkMode))),
    platform.setPicturesEmptyStates(['true', '1'].includes(String(body.usePicturesEmptyStates))),
    platform.setAppearanceMainColor(body.mainColor),
    platform.setAppearanceMenuMainColor(body.menuMainColor),
    platform.setAppearanceMenuDrawerColor(body.menuDrawerColor),
    platform.setLandscapeLogo(body.logoUrl),
    platform.setSquareLogo(body.squareLogoUrl),
    platform.setEmailLogo(body.emailLogoUrl),
    platform.setEmailWidthLogo(body.emailWidthLogo),
    users.updateEmail(userSession.id, body.email),
  ];
  if (body.password) {
    promises.push(users.updatePassword(userSession.id, body.password));
  }
  const { h, s, l } = colord(body.mainColor).toHsl();
  const { customPrimary } = jsonRaw.core.core.color;
  overrideColor(customPrimary, { h, s, l });
  await compileTokens(jsonRaw);
  await Promise.all(promises);
}

module.exports = updateOrganization;
