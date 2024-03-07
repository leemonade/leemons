async function listReports(page, size, filters) {
  return leemons.api(`v1/fundae/report/list?page=${page}&size=${size}`, {
    allAgents: true,
    method: 'POST',
    body: {
      filters,
    },
  });
}

export default listReports;
