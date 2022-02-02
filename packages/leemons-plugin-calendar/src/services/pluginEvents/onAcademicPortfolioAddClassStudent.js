function onAcademicPortfolioAddClassStudent(data, { class: classId, student, transacting }) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    try {
      await leemons.plugin.services.calendar.grantAccessUserAgentToCalendar(
        leemons.plugin.prefixPN(`class.${classId}`),
        student,
        'view',
        { transacting }
      );
      resolve();
    } catch (e) {
      console.error(e);
    }
  });
}

module.exports = { onAcademicPortfolioAddClassStudent };
