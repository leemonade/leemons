async function getDefaultPlatformLocale() {
  return leemons.api('users/platform/default-locale');
}

export default getDefaultPlatformLocale;
