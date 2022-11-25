async function listReports(page, size) {
  return leemons.api(`fundae/report/list?page=${page}&size=${size}`, {
    allAgents: true,
    method: 'GET',
  });
}

export default listReports;
