async function getAdminConfig(center) {
  const { config } = await leemons.api(
    `v1/comunica/config/admin/config/${center}`
  );

  return config;
}

export default getAdminConfig;
