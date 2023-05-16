export default function addPeriod(period) {
  return leemons.api('scores/periods', {
    method: 'POST',
    body: { period },
  });
}
