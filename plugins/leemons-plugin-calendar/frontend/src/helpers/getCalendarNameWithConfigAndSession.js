export default function getCalendarNameWithConfigAndSession(calendar, config, session) {
  let label = calendar.name;
  if (config && config.userCalendar && config.userCalendar.id === calendar.id)
    label = `${session?.surnames !== null ? session?.surnames : ''}${session.surnames ? ', ' : ''}${
      session?.name
    }`;
  return label;
}
