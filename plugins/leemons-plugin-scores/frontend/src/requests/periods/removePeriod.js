export default function removePeriod(periodId) {
  return leemons.api(`v1/scores/periods/${periodId}`, {
    method: 'DELETE',
  });
}
