async function getPlatformTheme() {
  return leemons.api(`users/platform/theme`);
}

export default getPlatformTheme;
