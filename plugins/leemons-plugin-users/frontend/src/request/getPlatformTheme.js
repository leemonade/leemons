async function getPlatformTheme() {
  const { theme } = await leemons.api(`users/platform/theme`);
  const { jsonTheme } = await leemons.api('admin/organization/jsonTheme');
  return { theme, jsonTheme };
}

export default getPlatformTheme;
