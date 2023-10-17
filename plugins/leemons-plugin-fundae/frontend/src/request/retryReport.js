async function retryReport(id) {
  return leemons.api(`fundae/report/retry`, {
    allAgents: true,
    method: 'POST',
    body: { id },
  });
}

export default retryReport;
