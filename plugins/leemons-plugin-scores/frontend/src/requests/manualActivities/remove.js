export async function removeManualActivity({ id }) {
  const { removed } = await leemons.api(`v1/scores/manualActivities/${id}`, {
    method: 'DELETE',
  });

  return removed;
}
