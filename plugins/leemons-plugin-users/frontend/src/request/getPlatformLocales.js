async function getPlatformLocales() {
  return leemons.api('v1/users/platform/locales');
}

export default getPlatformLocales;
