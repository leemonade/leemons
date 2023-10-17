async function generateReport(config) {
  return leemons.api(`fundae/report/add`, {
    allAgents: true,
    method: 'POST',
    body: config,
  });
}

export default generateReport;
