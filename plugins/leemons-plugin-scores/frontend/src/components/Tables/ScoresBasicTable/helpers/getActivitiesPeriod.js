export function getActivitiesPeriod({ periodName, from, to, locale }) {
  return (
    periodName ||
    `${new Date(from).toLocaleDateString(locale) ?? '?'} - ${
      new Date(to).toLocaleDateString(locale) ?? '?'
    }`
  );
}
