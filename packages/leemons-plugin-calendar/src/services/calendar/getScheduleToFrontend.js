/* eslint-disable no-param-reassign */
const _ = require('lodash');

function getBreakData(breaks) {
  const start = new Date();
  const end = new Date();
  const bStart = new Date(breaks.startDate);
  const bEnd = new Date(breaks.endDate);
  let sHour = bStart.getHours();
  let sMinute = bStart.getMinutes();
  let eHour = bEnd.getHours();
  let eMinute = bEnd.getMinutes();
  start.setHours(sHour, sMinute, 0);
  end.setHours(eHour, eMinute, 59);
  sHour = `${sHour > 9 ? '' : '0'}${sHour}`;
  sMinute = `${sMinute > 9 ? '' : '0'}${sMinute}`;
  eHour = `${eHour > 9 ? '' : '0'}${eHour}`;
  eMinute = `${eMinute > 9 ? '' : '0'}${eMinute}`;
  return {
    minHour: `${sHour}:${sMinute}`,
    minHourDate: start,
    maxHour: `${eHour}:${eMinute}`,
    maxHourDate: end,
  };
}

async function getScheduleToFrontend(userSession, { transacting } = {}) {
  if (userSession.sessionConfig?.program) {
    // eslint-disable-next-line prefer-const
    let [classes, config] = await Promise.all([
      leemons
        .getPlugin('academic-portfolio')
        .services.classes.listSessionClasses(
          userSession,
          { program: userSession.sessionConfig.program },
          { withProgram: true, withTeachers: true, transacting }
        ),
      leemons
        .getPlugin('academic-calendar')
        .services.config.getConfig(userSession.sessionConfig.program, { transacting }),
    ]);

    classes = _.filter(classes, ({ schedule }) => schedule && schedule.length);

    const week = [...Array(7).keys()];
    const firstDayOfWeek = 1;

    if (firstDayOfWeek > 0) {
      const e = [...Array(firstDayOfWeek).keys()];
      _.forEach(e, () => {
        week.push(week.shift());
      });
    }

    let courses = [];
    let minHour = null;
    let maxHour = null;
    let minHourDate = null;
    let maxHourDate = null;
    const dayWeeks = [];
    const configByCourse = {};

    const start = new Date();
    const end = new Date();
    let startSplit = null;
    let endSplit = null;

    if (config?.breaks?.length) {
      _.forEach(config.breaks, (breaks) => {
        const breakData = getBreakData(breaks);
        if (!minHour || breakData.minHourDate < minHourDate) {
          minHour = breakData.minHour;
          minHourDate = new Date(breakData.minHourDate);
        }
        if (!maxHour || breakData.maxHourDate > maxHourDate) {
          maxHour = breakData.maxHour;
          maxHourDate = new Date(breakData.maxHourDate);
        }
      });
    }

    _.forEach(classes, (classe) => {
      const classCourses = _.isArray(classe.courses) ? classe.courses : [classe.courses];
      const cIds = _.map(classCourses, 'id');
      courses = courses.concat(classCourses);
      _.forEach(cIds, (cId) => {
        if (!_.isObject(configByCourse[cId])) {
          configByCourse[cId] = {
            dayWeeks: [],
          };
          if (config?.breaks?.length) {
            _.forEach(config.breaks, (breaks) => {
              const breakData = getBreakData(breaks);
              if (
                !configByCourse[cId].minHour ||
                breakData.minHourDate < configByCourse[cId].minHourDate
              ) {
                configByCourse[cId].minHour = breakData.minHour;
                configByCourse[cId].minHourDate = breakData.minHourDate;
              }
              if (
                !configByCourse[cId].maxHour ||
                breakData.maxHourDate > configByCourse[cId].maxHourDate
              ) {
                configByCourse[cId].maxHour = breakData.maxHour;
                configByCourse[cId].maxHourDate = breakData.maxHourDate;
              }
            });
          }
        }
      });

      _.forEach(classe.schedule, (schedule) => {
        startSplit = schedule.start.split(':');
        endSplit = schedule.end.split(':');
        start.setHours(parseInt(startSplit[0], 10), parseInt(startSplit[1], 10), 0);
        end.setHours(parseInt(endSplit[0], 10), parseInt(endSplit[1], 10), 59);
        dayWeeks.push(schedule.dayWeek);
        _.forEach(cIds, (cId) => {
          configByCourse[cId].dayWeeks.push(schedule.dayWeek);
          // Por curso
          if (!configByCourse[cId].minHour || start < configByCourse[cId].minHourDate) {
            configByCourse[cId].minHour = schedule.start;
            configByCourse[cId].minHourDate = new Date(start);
          }
          if (!configByCourse[cId].maxHour || end > configByCourse[cId].maxHourDate) {
            configByCourse[cId].maxHour = schedule.end;
            configByCourse[cId].maxHourDate = new Date(end);
          }
        });

        // General
        if (!minHour || start < minHourDate) {
          minHour = schedule.start;
          minHourDate = new Date(start);
        }
        if (!maxHour || end > maxHourDate) {
          maxHour = schedule.end;
          maxHourDate = new Date(end);
        }
      });
    });

    _.forIn(configByCourse, (conf, key) => {
      const scheduleDays = conf.dayWeeks.map((item) => week.indexOf(item));
      configByCourse[key].minDayWeek = Math.min(...scheduleDays);
      configByCourse[key].maxDayWeek = Math.max(...scheduleDays);
    });

    courses = _.sortBy(_.uniqBy(courses, 'id'), ['index']);
    const scheduleDays = dayWeeks.map((item) => week.indexOf(item));

    return {
      calendarConfig: {
        minDayWeek: Math.min(...scheduleDays),
        maxDayWeek: Math.max(...scheduleDays),
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
