export default function useScoresTableTitle({ class: klass, period } = {}) {
  if (!klass) {
    return null;
  }
  let title = '';

  const groupName = [klass.groups]
    .flatMap((group) => group?.name ?? null)
    .filter((name) => name)
    .join(', ');

  title = `${klass.subject.name}`;
  if (groupName) {
    title += ` - ${groupName}`;
  }

  if (period?.period?.name) {
    title += ` - ${period.period.name}`;
  }
  return title;
}
