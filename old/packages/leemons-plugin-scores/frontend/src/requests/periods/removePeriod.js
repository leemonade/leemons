export default function removePeriod(periodId) {
  return leemons.api(`scores/periods/${periodId}`, {
    method: 'DELETE',
  });
}
