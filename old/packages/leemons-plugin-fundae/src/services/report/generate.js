/* eslint-disable no-nested-ternary */
const _ = require('lodash');
const { DateTime } = require('luxon');
const { forEach, orderBy } = require('lodash');
const { tables } = require('../tables');

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getNoteAsText(grade, evaluationSystem) {
  const userNote = parseFloat(grade || evaluationSystem.minScale.number);

  let scale = null;
  _.forEach(orderBy(evaluationSystem.scales, ['number'], ['asc']), (s) => {
    if (userNote >= s.number) {
      scale = s;
    } else if (scale) {
      const diff1 = userNote - scale.number;
      const diff2 = s.number - userNote;
      if (diff2 <= diff1) {
        scale = s;
      }
      return false;
    } else {
      scale = s;
      return false;
    }
  });
  return scale?.letter;
}

async function updateReportPer(report, percentageCompleted, dataToSocket) {
  await tables.report.update(
    { id: report.id },
    {
      percentageCompleted,
    }
  );
  await leemons.socket.emit(report.creator, `FUNDAE_REPORT_CHANGE`, {
    ...dataToSocket,
    id: report.id,
    percentageCompleted,
  });
}

async function startGeneration(report, dataToSocket) {
  try {
    const toSave = {};
    const xapiServices = leemons.getPlugin('xapi').services;
    const userServices = leemons.getPlugin('users').services;
    const comunicaServices = leemons.getPlugin('comunica').services;
    const assignableServices = leemons.getPlugin('assignables').services;
    const academicPortfolioServices = leemons.getPlugin('academic-portfolio').services;
    const academicCalendarServices = leemons.getPlugin('academic-calendar').services;

    const [program] = await academicPortfolioServices.programs.programsByIds(report.program);
    const course = report.course
      ? _.find(program.courses, { id: report.course })
      : program.courses[0];
    const coursesLength = program.courses.length;
    const courseIsAlone = coursesLength === 1 ? program.courses[0].isAlone : false;

    const center = await userServices.centers.detail(program.centers[0]);

    toSave.centerId = center.id;
    toSave.centerName = center.name;
    toSave.programId = program.id;
    toSave.programName = program.name;
    toSave.programHours = program.totalHours;
    toSave.programAbbreviation = program.abbreviation;
    toSave.programNCourses = courseIsAlone ? 0 : coursesLength;

    const [calendarConfig] = await Promise.all([
      academicCalendarServices.config.getConfig(program.id),
      updateReportPer(report, 5, dataToSocket),
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

    const courseDates = course ? _.find(toSave.courses, { id: course.id }) : toSave.courses[0];

    const [[userAgentInfo]] = await Promise.all([
      userServices.users.getUserAgentsInfo([report.userAgent]),
      updateReportPer(report, 10, dataToSocket),
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
      academicPortfolioServices.programs.getUsersInProgram(program.id, {
        course: report.course || program.courses[0].id,
        onlyStudents: true,
      }),
      updateReportPer(report, 15, dataToSocket),
    ]);

    toSave.usersInProgram = usersInProgram.length;

    let classesPromise = null;
    if (course) {
      classesPromise = academicPortfolioServices.classes.getClassesUnderProgramCourse(
        program.id,
        course.id
      );
    } else {
      classesPromise = academicPortfolioServices.classes.getClassesUnderProgram(program.id);
    }

    const [classesIds] = await Promise.all([
      classesPromise,
      updateReportPer(report, 25, dataToSocket),
    ]);

    toSave.classVideoN = 0;

    function getDaysBetweenDates(start, end, weekDay) {
      const result = [];
      // Copy start date
      const current = new Date(start);
      // Shift to next of required days
      current.setDate(current.getDate() + ((weekDay - current.getDay() + 7) % 7));
      // While less than end date, add dates to result array
      while (current < end) {
        result.push(new Date(+current));
        current.setDate(current.getDate() + 7);
      }
      return result;
    }

    if (courseDates?.startDate && courseDates?.endDate) {
      const classes = await academicPortfolioServices.classes.classByIds(classesIds);
      _.forEach(classes, (classe) => {
        _.forEach(classe.schedule, ({ dayWeek }) => {
          toSave.classVideoN += getDaysBetweenDates(
            new Date(courseDates.startDate),
            new Date(courseDates.endDate),
            dayWeek
          ).length;
        });
      });
    }

    const [xapiVirtualClass, xapiProgramViewDates, xapiLeebraryMediaFiles] = await Promise.all([
      xapiServices.xapi.find({
        type: 'log',
        $sort: 'created_at:asc',
        'statement.actor.account.name': report.userAgent.toString(),
        'statement.object.definition.extensions.id_$in': classesIds,
        'statement.object.id_$endsWith': '/api/open/virtual-classroom',
      }),
      xapiServices.xapi.find({
        type: 'log',
        $sort: 'created_at:asc',
        'statement.actor.account.name': report.userAgent.toString(),
        'statement.object.definition.extensions.id': program.id.toString(),
        'statement.object.id_$endsWith': '/api/view/program',
      }),
      xapiServices.xapi.find({
        type: 'log',
        $sort: 'created_at:asc',
        'statement.actor.account.name': report.userAgent.toString(),
        'statement.object.definition.extensions.program': program.id.toString(),
        'statement.object.id_$endsWith': '/api/view/leebrary/media-files',
      }),
      updateReportPer(report, 40, dataToSocket),
    ]);

    toSave.mediaFiles = [];
    _.forEach(xapiLeebraryMediaFiles, (item) => {
      const index = _.findIndex(toSave.mediaFiles, {
        id: item.statement.object.definition.extensions.id,
      });
      if (index < 0) {
        toSave.mediaFiles.push({
          id: item.statement.object.definition.extensions.id,
          name: item.statement.object.definition.extensions.name,
          first: item.created_at,
          last: item.created_at,
        });
      } else {
        toSave.mediaFiles[index].last = item.created_at;
      }
    });

    toSave.virtualClassClicks = [];
    _.forEach(xapiVirtualClass, (item) => {
      toSave.virtualClassClicks.push({
        name: item.statement.object.definition.extensions.name,
        date: item.created_at,
        url: item.statement.object.definition.extensions.url,
      });
    });

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
          const diffSeconds = e.diff(s, ['seconds']);
          toSave.connections.push({
            ...con,
            start: con.start.toString(),
            end: con.end.toString(),
            timeInSeconds: diffSeconds.values.seconds,
            time: `${diff.values.hours.toFixed(0).padStart(2, '0')}:${diff.values.minutes
              .toFixed(0)
              .padStart(2, '0')}:${diff.values.seconds.toFixed(0).padStart(2, '0')}`,
          });
          con.start = null;
          con.end = null;
          con.ip = null;
        }
      }
    });

    toSave.firstConnection = toSave.connections[0]?.start;
    toSave.lastConnection = toSave.connections[toSave.connections.length - 1]?.end;
    toSave.totalHoursConnected = 0;
    _.forEach(toSave.connections, ({ timeInSeconds }) => {
      toSave.totalHoursConnected += timeInSeconds;
    });
    toSave.totalHoursConnected = (toSave.totalHoursConnected / 3600).toFixed(2);

    const [assignablesData] = await Promise.all([
      assignableServices.assignations.getUserDataForFundae(report.userAgent, classesIds),
      updateReportPer(report, 55, dataToSocket),
    ]);

    let evaluationSystem = null;
    try {
      evaluationSystem = await academicPortfolioServices.programs.getProgramEvaluationSystem(
        program.id
      );
    } catch (e) {}

    toSave.exams = {};

    _.forEach(assignablesData.gradables, (exam, index) => {
      _.forEach(exam.subjects, (subjectId) => {
        if (!toSave.exams[subjectId])
          toSave.exams[subjectId] = {
            name: _.find(program.subjects, { id: subjectId })?.name,
            items: [],
          };
        const grade = _.find(assignablesData.grades, { subject: subjectId, assignation: exam.id });
        const data = {
          n: index,
          name: exam.asset.name,
          type: capitalizeFirstLetter(exam.assignable.role),
          note: grade ? grade.grade : null,
          noteLetter:
            grade && evaluationSystem ? getNoteAsText(grade.grade, evaluationSystem) : null,
          status: !!exam.endDate,
          deliveredOn: exam.endDate?.date || null,
          evaluatedOn: grade ? grade.date : null,
        };
        toSave.exams[subjectId].items.push(data);
      });
    });

    toSave.examsPlatform = assignablesData.gradables.length;
    toSave.totalExams = toSave.examsPlatform;
    toSave.lessonsPlatfom = assignablesData.noGradables.length;
    toSave.examsPerformed = `${
      (assignablesData.endDatesGradables.length / assignablesData.gradables.length) * 100
    }% (${assignablesData.endDatesGradables.length}/${assignablesData.gradables.length})`;
    toSave.lessonsPerformed = `${
      (assignablesData.endDatesNoGradables.length / assignablesData.noGradables.length) * 100
    }% (${assignablesData.endDatesNoGradables.length}/${assignablesData.noGradables.length})`;

    toSave.totalPerformed = `${
      ((assignablesData.endDatesNoGradables.length + assignablesData.endDatesGradables.length) /
        (assignablesData.noGradables.length + assignablesData.gradables.length)) *
      100
    }% (${assignablesData.endDatesNoGradables.length + assignablesData.endDatesGradables.length}/${
      assignablesData.noGradables.length + assignablesData.gradables.length
    })`;

    const [teachersInClasses] = await Promise.all([
      academicPortfolioServices.classes.teacher.getByClass(classesIds, {
        type: 'main-teacher',
        returnIds: true,
      }),
      updateReportPer(report, 65, dataToSocket),
    ]);

    toSave.nTeachers = teachersInClasses.length;

    const [userAgentRooms] = await Promise.all([
      comunicaServices.room.getUserAgentRooms(report.userAgent),
      updateReportPer(report, 70, dataToSocket),
    ]);

    const promises1 = [];
    const promises2 = [];
    _.forEach(userAgentRooms, (room) => {
      promises1.push(comunicaServices.room.get(room, report.userAgent, { returnUserAgents: true }));
      promises2.push(comunicaServices.room.getMessages(room, report.userAgent));
    });

    const [rooms, roomMessages] = await Promise.all([
      Promise.all(promises1),
      Promise.all(promises2),
      updateReportPer(report, 90, dataToSocket),
    ]);

    toSave.privateChats = [];
    toSave.nMessagesSend = 0;
    toSave.nMessagesReceived = 0;

    _.forEach(rooms, (room, index) => {
      if (room.messages) {
        // Chats privados
        if (room.userAgents.length === 2) {
          const privateChat = {
            ...room,
            userAgents: _.keyBy(_.map(room.userAgents, 'userAgent'), 'id'),
            messages: [],
          };
          _.forEach(roomMessages[index], (message) => {
            if (message.userAgent === report.userAgent) {
              toSave.nMessagesSend++;
            } else {
              toSave.nMessagesReceived++;
            }
            privateChat.messages.push({
              created_at: message.created_at,
              userAgent: message.userAgent,
              message: message.message,
              id: message.id,
            });
          });
          toSave.privateChats.push(privateChat);
        }
      }
    });

    await tables.report.update(
      { id: report.id },
      {
        report: toSave,
      }
    );

    await updateReportPer(report, 100, { ...dataToSocket, report: toSave });

    // console.log(toSave);
  } catch (e) {
    console.error(e);
    updateReportPer(report, 0, dataToSocket);
  }
}

async function retry(id) {
  const report = await tables.report.findOne({ id });
  const userServices = leemons.getPlugin('users').services;
  const [userAgentInfo] = await userServices.users.getUserAgentsInfo([report.userAgent]);
  startGeneration(report, {
    name: [userAgentInfo.user.name, userAgentInfo.user.surnames, userAgentInfo.user.secondSurname]
      .filter((item) => !_.isEmpty(item))
      .join(' '),
  });
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
      percentageCompleted: 1,
    },
    { transacting }
  );
  const userServices = leemons.getPlugin('users').services;
  const [userAgentInfo] = await userServices.users.getUserAgentsInfo([report.userAgent]);
  startGeneration(report, {
    name: [userAgentInfo.user.name, userAgentInfo.user.surnames, userAgentInfo.user.secondSurname]
      .filter((item) => !_.isEmpty(item))
      .join(' '),
  });
  return report;
}

module.exports = { generate, retry };
