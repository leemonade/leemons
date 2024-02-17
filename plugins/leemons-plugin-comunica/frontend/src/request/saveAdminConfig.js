async function saveAdminConfig(center, data) {
  const { config } = await leemons.api(
    `v1/comunica/config/admin/config/${center}`,
    {
      allAgents: true,
      method: 'POST',
      body: data,
    }
  );

  return config;
}

export default saveAdminConfig;
