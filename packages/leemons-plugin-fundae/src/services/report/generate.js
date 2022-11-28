/* eslint-disable no-nested-ternary */
const _ = require('lodash');
const { getUsersInProgram } = require('leemons-plugin-academic-portfolio/src/services/programs');
const { DateTime } = require('luxon');
const { tables } = require('../tables');

async function updateReportPer(report, percentageCompleted) {
  await tables.report.update(
    { id: report.id },
    {
      percentageCompleted,
    }
  );
  await leemons.socket.emit(report.creator, `FUNDAE_REPORT_CHANGE`, {
    id: report.id,
    percentageCompleted,
  });
}

async function startGeneration(report) {
  try {
    const toSave = {};
    const xapiServices = leemons.getPlugin('xapi').services;
    const userServices = leemons.getPlugin('users').services;
    const academicPortfolioServices = leemons.getPlugin('academic-portfolio').services;
    const academicCalendarServices = leemons.getPlugin('academic-calendar').services;

    const [program] = await academicPortfolioServices.programs.programsByIds(report.program);
    const course = _.find(program.courses, { id: report.course });
    const coursesLength = program.courses.length;
    const courseIsAlone = coursesLength === 1 ? program.courses[0].isAlone : false;

    toSave.programId = program.id;
    toSave.programName = program.name;
    toSave.programHours = program.totalHours;
    toSave.programAbbreviation = program.abbreviation;
    toSave.programNCourses = courseIsAlone ? 0 : coursesLength;

    const [calendarConfig] = await Promise.all([
      academicCalendarServices.config.getConfig(program.id),
      updateReportPer(report, 5),
    ]);

    if (!courseIsAlone) {
      toSave.courses = [];
      _.forEach(program.courses, (cours) => {
        let calendarDates = null;
        if (calendarConfig?.courseDates?.[cours.id]) {
          calendarDates = calendarConfig.courseDates[cours.id];
        }
        toSave.courses.push({
          id: cours.id,
          name: cours.name || cours.abbreviation || cours.index.toString(),
          startDate: calendarDates?.startDate,
          endDate: calendarDates?.endDate,
        });
      });
    }

    const [[userAgentInfo]] = await Promise.all([
      userServices.users.getUserAgentsInfo([report.userAgent]),
      updateReportPer(report, 10),
    ]);

    toSave.userAgentId = userAgentInfo.id;
    toSave.userAgentEmail = userAgentInfo.user.email;
    toSave.userAgentName = [
      userAgentInfo.user.name,
      userAgentInfo.user.surnames,
      userAgentInfo.user.secondSurname,
    ]
      .filter((item) => !_.isEmpty(item))
      .join(' ');

    const [usersInProgram] = await Promise.all([
      academicPortfolioServices.programs.getUsersInProgram(program.id, { course: report.course }),
      updateReportPer(report, 15),
    ]);

    toSave.usersInProgram = usersInProgram.length;

    const [xapiProgramViewDates] = await Promise.all([
      xapiServices.xapi.find({
        type: 'log',
        $sort: 'created_at:asc',
        'statement.actor.account.name': report.userAgent.toString(),
        'statement.object.definition.extensions.id': program.id.toString(),
        'statement.object.id_$endsWith': '/api/view/program',
      }),
      updateReportPer(report, 15),
    ]);

    toSave.connections = [];
    const con = {
      start: null,
      end: null,
      ip: null,
    };
    const indexsUsed = [];
    _.forEach(xapiProgramViewDates, (item, index) => {
      if (!indexsUsed.includes(index)) {
        indexsUsed.push(index);
        if (item.statement.verb.id === xapiServices.xapi.Verbs.INITIALIZED.id) {
          con.start = item.created_at;
          con.ip = item.statement.object.definition.extensions.ip;
          const nextItem = xapiProgramViewDates[index + 1];
          if (nextItem) {
            // Si hay siguiente item tenemos que comprobar que sea de terminar si no lo es generamos nostros el terinar 15 minutos despues (Algo peto y no se registro)
            if (nextItem.statement.verb.id === xapiServices.xapi.Verbs.TERMINATED.id) {
              con.end = nextItem.created_at;
              indexsUsed.push(index + 1);
            } else {
              // TODO almacenar estos para procesarlos despeus co probando que no esten ya dentro de algun otro margen de fechas.
              const date = new Date(item.created_at);
              date.setMinutes(date.getMinutes() + 15);
              con.end = date;
            }
          } else {
            // Si no hay siguiente item es que esta dentro ahora mismo y no se ha salido, no hacemos nada y que no se registre
          }
        }
        if (con.start && con.end) {
          const s = DateTime.fromJSDate(con.start);
          const e = DateTime.fromJSDate(con.end);
          const diff = e.diff(s, ['hours', 'minutes', 'seconds']);
          toSave.connections.push({
            ...con,
            start: con.start.toString(),
            end: con.end.toString(),
            time: `${diff.values.hours.toFixed(0)}:${diff.values.minutes.toFixed(
              0
            )}:${diff.values.seconds.toFixed(0)}`,
          });
          con.start = null;
          con.end = null;
          con.ip = null;
        }
      }
    });

    console.log(toSave);
  } catch (e) {
    console.error(e);
  }
}

async function generate(userAgent, program, { course, userSession, transacting } = {}) {
  if (_.isArray(userAgent)) {
    return Promise.all(
      _.map(userAgent, (e) =>
        generate(e, program, {
          course,
          userSession,
          transacting,
        })
      )
    );
  }
  const report = await tables.report.create(
    {
      program,
      course,
      userAgent,
      creator: userSession.userAgents[0].id,
      percentageCompleted: 0,
    },
    { transacting }
  );
  startGeneration(report);
  return report;
}

module.exports = { generate };
