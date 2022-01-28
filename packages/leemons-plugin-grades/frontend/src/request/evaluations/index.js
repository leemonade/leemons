const pluginPath = 'grades';

async function listGrades({ page, size, center }) {
  return leemons.api(`${pluginPath}/grades?page=${page}&size=${size}&center=${center}`, {
    allAgents: true,
  });
}

export { listGrades };
