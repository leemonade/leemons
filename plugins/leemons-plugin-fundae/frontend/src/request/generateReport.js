async function generateReport(config) {
  return leemons.api(`v1/fundae/report/add`, {
    allAgents: true,
    method: 'POST',
    body: config,
  });
}

export default generateReport;
