async function getPlatformLocales() {
  return leemons.api('users/platform/locales');
}

export default getPlatformLocales;
