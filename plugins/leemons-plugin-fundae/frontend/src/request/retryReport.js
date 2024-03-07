async function retryReport(id) {
  return leemons.api(`v1/fundae/report/retry`, {
    allAgents: true,
    method: 'POST',
    body: { id },
  });
}

export default retryReport;
