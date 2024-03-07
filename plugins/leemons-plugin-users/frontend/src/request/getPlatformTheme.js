async function getPlatformTheme() {
  const { theme } = await leemons.api(`v1/users/platform/theme`);
  const { jsonTheme } = await leemons.api('v1/admin/organization/jsonTheme');
  return { theme, jsonTheme };
}

export default getPlatformTheme;
