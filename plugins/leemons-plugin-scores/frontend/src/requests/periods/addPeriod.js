export default function addPeriod(period) {
  return leemons.api('v1/scores/periods', {
    method: 'POST',
    body: { period },
  });
}
