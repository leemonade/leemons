async function getAdminDashboard({ program, start, end } = {}) {
  return leemons.api(`dashboard/admin?program=${program}&start=${start}&end=${end}`, {
    allAgents: true,
    method: 'GET',
  });
}

export { getAdminDashboard };
