async function getDefaultPlatformLocale() {
  return leemons.api('v1/users/platform/default-locale');
}

export default getDefaultPlatformLocale;
