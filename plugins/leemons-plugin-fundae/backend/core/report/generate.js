/* eslint-disable no-nested-ternary */
const _ = require('lodash');
const { DateTime } = require('luxon');
const { forEach, orderBy } = require('lodash');
const { XAPIVerbs } = require('@leemons/xapi');

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

async function updateReportPer({ report, percentageCompleted, dataToSocket, ctx }) {
  await ctx.tx.db.Report.updateOne(
    { id: report.id },
    {
      percentageCompleted,
    }
  );
  await ctx.socket.emit(report.creator, `FUNDAE_REPORT_CHANGE`, {
    ...dataToSocket,
    id: report.id,
    percentageCompleted,
  });
}

async function startGeneration({ report, dataToSocket, ctx }) {
  try {
    const toSave = {};

    const [program] = await ctx.tx.call('academic-portfolio.programs.programsByIds', {
      ids: [report.program],
    });
    const course = report.course
      ? _.find(program.courses, { id: report.course })
      : program.courses[0];
    const coursesLength = program.courses.length;
    const courseIsAlone = coursesLength === 1 ? program.courses[0].isAlone : false;

    const center = await ctx.tx.call('users.centers.detail', { id: program.centers[0] });

    toSave.centerId = center.id;
    toSave.centerName = center.name;
    toSave.programId = program.id;
    toSave.programName = program.name;
    toSave.programHours = program.totalHours;
    toSave.programAbbreviation = program.abbreviation;
    toSave.programNCourses = courseIsAlone ? 0 : coursesLength;

    const [calendarConfig] = await Promise.all([
      ctx.tx.call('academic-calendar.config.getConfig', { program: program.id }),
      updateReportPer({ report, percentageCompleted: 5, dataToSocket, ctx }),
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
      ctx.tx.call('users.users.getUserAgentsInfo', {
        userAgentsIds: [report.userAgent],
      }),
      updateReportPer({ report, percentageCompleted: 10, dataToSocket, ctx }),
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
      ctx.tx.call('academic-portfolio.programs.getUsersInProgram', {
        program: program.id,
        course: report.course || program.courses[0].id,
        onlyStudents: true,
      }),
      updateReportPer({ report, percentageCompleted: 15, dataToSocket, ctx }),
    ]);

    toSave.usersInProgram = usersInProgram.length;

    let classesPromise = null;
    if (course) {
      classesPromise = await ctx.tx.call(
        'academic-portfolio.classes.getClassesUnderProgramCourse',
        {
          program: program.id,
          course: course.id,
        }
      );
    } else {
      classesPromise = await ctx.tx.call('academic-portfolio.classes.getClassesUnderProgram', {
        program: program.id,
      });
    }

    const [classesIds] = await Promise.all([
      classesPromise,
      updateReportPer({ report, percentageCompleted: 25, dataToSocket, ctx }),
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
      const classes = await ctx.tx.call('academic-portfolio.classes.classByIds', {
        ids: classesIds,
      });
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
      ctx.tx.call('xapi.xapi.find', {
        query: {
          type: 'log',
          'statement.actor.account.name': report.userAgent.toString(),
          'statement.object.definition.extensions.id': classesIds,
          'statement.object.id': {
            $regex: /^.*\/api\/open\/virtual-classroom$/,
          },
        },
        sort: { createdAt: 1 },
      }),
      ctx.tx.call('xapi.xapi.find', {
        query: {
          type: 'log',
          'statement.actor.account.name': report.userAgent.toString(),
          'statement.object.definition.extensions.id': program.id.toString(),
          'statement.object.id': {
            $regex: /^.*\/api\/view\/program$/,
          },
        },
        sort: { createdAt: 1 },
      }),
      ctx.tx.call('xapi.xapi.find', {
        query: {
          type: 'log',
          'statement.actor.account.name': report.userAgent.toString(),
          'statement.object.definition.extensions.program': program.id.toString(),
          'statement.object.id': {
            $regex: /^.*\/api\/view\/leebrary\/media-files$/,
          },
        },
        sort: { createdAt: 1 },
      }),
      updateReportPer({ report, percentageCompleted: 40, dataToSocket, ctx }),
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
          first: item.createdAt,
          last: item.createdAt,
        });
      } else {
        toSave.mediaFiles[index].last = item.createdAt;
      }
    });

    toSave.virtualClassClicks = [];
    _.forEach(xapiVirtualClass, (item) => {
      toSave.virtualClassClicks.push({
        name: item.statement.object.definition.extensions.name,
        date: item.createdAt,
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
        if (item.statement.verb.id === XAPIVerbs.INITIALIZED.id) {
          con.start = item.createdAt;
          con.ip = item.statement.object.definition.extensions.ip;
          const nextItem = xapiProgramViewDates[index + 1];
          if (nextItem) {
            // Si hay siguiente item tenemos que comprobar que sea de terminar si no lo es generamos nostros el terinar 15 minutos despues (Algo peto y no se registro)
            if (nextItem.statement.verb.id === XAPIVerbs.TERMINATED.id) {
              con.end = nextItem.createdAt;
              indexsUsed.push(index + 1);
            } else {
              // TODO almacenar estos para procesarlos despeus co probando que no esten ya dentro de algun otro margen de fechas.
              const date = new Date(item.createdAt);
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
      ctx.tx.call('assignables.assignations.getUserDataForFundae', {
        userAgent: report.userAgent,
        classes: classesIds,
      }),
      updateReportPer({ report, percentageCompleted: 55, dataToSocket, ctx }),
    ]);

    let evaluationSystem = null;
    try {
      evaluationSystem = await ctx.call('academic-portfolio.programs.getProgramEvaluationSystem', {
        id: program.id,
      });
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
      ctx.tx.call('academic-portfolio.classes.teacherGetByClass', {
        classe: classesIds,
        type: 'main-teacher',
        returnIds: true,
      }),
      updateReportPer({ report, percentageCompleted: 65, dataToSocket, ctx }),
    ]);

    toSave.nTeachers = teachersInClasses.length;

    const [userAgentRooms] = await Promise.all([
      ctx.tx.call('comunica.room.getUserAgentRooms', {
        userAgent: report.userAgent,
      }),
      updateReportPer({ report, percentageCompleted: 70, dataToSocket, ctx }),
    ]);

    const promises1 = [];
    const promises2 = [];
    _.forEach(userAgentRooms, (room) => {
      promises1.push(
        ctx.tx.call('comunica.room.get', {
          key: room,
          userAgent: report.userAgent,
          returnUserAgents: true,
        })
      );
      promises2.push(
        ctx.tx.call('comunica.room.getMessages', {
          key: room,
          userAgent: report.userAgent,
        })
      );
    });

    const [rooms, roomMessages] = await Promise.all([
      Promise.all(promises1),
      Promise.all(promises2),
      updateReportPer({ report, percentageCompleted: 90, dataToSocket, ctx }),
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
              createdAt: message.createdAt,
              userAgent: message.userAgent,
              message: message.message,
              id: message.id,
            });
          });
          toSave.privateChats.push(privateChat);
        }
      }
    });

    await ctx.tx.db.Report.updateOne(
      { id: report.id },
      {
        report: toSave,
      }
    );

    await updateReportPer({
      report,
      percentageCompleted: 100,
      dataToSocket: { ...dataToSocket, report: toSave },
      ctx,
    });

    // console.log(toSave);
  } catch (e) {
    console.error(e);
    await updateReportPer({ report, percentageCompleted: 0, dataToSocket, ctx });
  }
}

async function retry({ id, ctx }) {
  const report = await ctx.tx.db.Report.findOne({ id }).lean();
  const [userAgentInfo] = await ctx.tx.call('users.users.getUserAgentsInfo', {
    userAgentIds: [report.userAgent],
  });
  startGeneration({
    report,
    dataToSocket: {
      name: [userAgentInfo.user.name, userAgentInfo.user.surnames, userAgentInfo.user.secondSurname]
        .filter((item) => !_.isEmpty(item))
        .join(' '),
    },
    ctx,
  });
}

async function generate({ userAgent, program, course, ctx }) {
  const { userSession } = ctx.meta;
  if (_.isArray(userAgent)) {
    return Promise.all(
      _.map(userAgent, (e) =>
        generate({
          userAgent: e,
          program,
          course,
          userSession,
          ctx,
        })
      )
    );
  }
  let report = await ctx.tx.db.Report.create({
    program,
    course,
    userAgent,
    creator: userSession.userAgents[0].id,
    percentageCompleted: 1,
  });
  report = report.toObject();
  const [userAgentInfo] = await ctx.tx.call('users.users.getUserAgentsInfo', {
    userAgentIds: [report.userAgent],
  });
  startGeneration({
    report,
    dataToSocket: {
      name: [userAgentInfo.user.name, userAgentInfo.user.surnames, userAgentInfo.user.secondSurname]
        .filter((item) => !_.isEmpty(item))
        .join(' '),
    },
    ctx,
  });
  return report;
}

module.exports = { generate, retry };
