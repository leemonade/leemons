/* eslint-disable no-param-reassign */
const _ = require('lodash');

async function getScheduleToFrontend(userSession, { transacting } = {}) {
  if (userSession.sessionConfig?.program) {
    // eslint-disable-next-line prefer-const
    let [classes, config] = await Promise.all([
      leemons
        .getPlugin('academic-portfolio')
        .services.classes.listSessionClasses(
          userSession,
          { program: userSession.sessionConfig.program },
          { transacting }
        ),
      leemons
        .getPlugin('academic-calendar')
        .services.config.getConfig(userSession.sessionConfig.program, { transacting }),
    ]);

    classes = _.filter(classes, ({ schedule }) => schedule && schedule.length);

    let courses = [];
    let minDayWeek = null;
    let maxDayWeek = null;
    let minHour = null;
    let maxHour = null;
    let minHourDate = null;
    let maxHourDate = null;
    const configByCourse = {};

    const start = new Date();
    const end = new Date();
    let startSplit = null;
    let endSplit = null;
    _.forEach(classes, (classe) => {
      const classCourses = _.isArray(classe.courses) ? classe.courses : [classe.courses];
      const cId = classCourses[0].id;
      courses = courses.concat(classCourses);
      if (!_.isObject(configByCourse[cId])) {
        configByCourse[cId] = {};
      }
      _.forEach(classe.schedule, (schedule) => {
        console.log(schedule);
        startSplit = schedule.start.split(':');
        endSplit = schedule.end.split(':');
        start.setHours(parseInt(startSplit[0], 10), parseInt(startSplit[1], 10));
        end.setHours(parseInt(endSplit[0], 10), parseInt(endSplit[1], 10));
        // Por curso
        if (
          !_.isNumber(configByCourse[cId].minDayWeek) ||
          schedule.dayWeek < configByCourse[cId].minDayWeek
        ) {
          configByCourse[cId].minDayWeek = schedule.dayWeek;
        }
        if (
          !_.isNumber(configByCourse[cId].maxDayWeek) ||
          schedule.dayWeek > configByCourse[cId].maxDayWeek
        ) {
          configByCourse[cId].maxDayWeek = schedule.dayWeek;
        }
        if (!configByCourse[cId].minHour || start < configByCourse[cId].minHourDate) {
          configByCourse[cId].minHour = schedule.start;
          configByCourse[cId].minHourDate = start;
        }
        if (!configByCourse[cId].maxHour || end > configByCourse[cId].maxHourDate) {
          configByCourse[cId].maxHour = schedule.end;
          configByCourse[cId].maxHourDate = end;
        }

        // General
        if (!_.isNumber(minDayWeek) || schedule.dayWeek < minDayWeek) {
          minDayWeek = schedule.dayWeek;
        }
        if (!_.isNumber(maxDayWeek) || schedule.dayWeek > maxDayWeek) {
          maxDayWeek = schedule.dayWeek;
        }
        if (!minHour || start < minHourDate) {
          minHour = schedule.start;
          minHourDate = start;
        }
        if (!maxHour || end > maxHourDate) {
          maxHour = schedule.end;
          maxHourDate = end;
        }
      });
    });

    courses = _.sortBy(_.uniqBy(courses, 'id'), ['index']);

    return {
      calendarConfig: {
        minDayWeek,
        maxDayWeek,
        minHour,
        maxHour,
        minHourDate,
        maxHourDate,
      },
      calendarConfigByCourse: configByCourse,
      classes,
      courses,
      config,
    };
  }
  return null;
}

module.exports = { getScheduleToFrontend };
