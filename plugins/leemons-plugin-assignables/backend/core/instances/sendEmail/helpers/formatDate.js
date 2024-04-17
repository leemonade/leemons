function formatDate({ instance, userAgent }) {
  let date = null;
  const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
  if (instance?.dates?.deadline) {
    const date1 = new Date(instance.dates.deadline);
    const dateTimeFormat = new Intl.DateTimeFormat(userAgent.user.locale, options);
    date = dateTimeFormat.format(date1);
  }
  return date;
}

module.exports = { formatDate };
