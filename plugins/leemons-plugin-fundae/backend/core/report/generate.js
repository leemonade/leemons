/* eslint-disable no-nested-ternary */
const _ = require('lodash');
const { DateTime } = require('luxon');
const { orderBy } = require('lodash');
const { XAPIVerbs } = require('@leemons/xapi');

const USER_AGENT_INFO_ENDPOINT = 'users.users.getUserAgentsInfo';
const XAPI_FIND_ENDPOINT = 'xapi.xapi.find';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

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

function getGradeAsText(grade, evaluationSystem) {
  const userGrade = parseFloat(grade || evaluationSystem.minScale.number);

  let scale = null;
  _.forEach(orderBy(evaluationSystem.scales, ['number'], ['asc']), (s) => {
    if (userGrade >= s.number) {
      scale = s;
    } else if (scale) {
      const diff1 = userGrade - scale.number;
      const diff2 = s.number - userGrade;
      if (diff2 <= diff1) {
        scale = s;
      }
      return false;
    } else {
      scale = s;
      return false;
    }
    return false;
  });
  return scale?.letter;
}

async function updateReportProgress({ report, percentageCompleted, dataToSocket, ctx }) {
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

async function initializeReportData({ report, ctx }) {
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
  toSave.courses = !courseIsAlone ? [] : null;

  return { toSave, course, courseIsAlone, program };
}

async function handleCourseDates({ program, course, courseIsAlone, toSave, ctx }) {
  const calendarConfig = await ctx.tx.call('academic-calendar.config.getConfig', {
    program: program.id,
  });

  if (!courseIsAlone) {
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

  return course ? _.find(toSave.courses, { id: course.id }) : toSave.courses[0];
}

async function handleUserAgentInfo({ report, ctx }) {
  const [userAgentInfo] = await ctx.tx.call(USER_AGENT_INFO_ENDPOINT, {
    userAgentsIds: [report.userAgent],
  });

  return {
    userAgentId: userAgentInfo.id,
    userAgentEmail: userAgentInfo.user.email,
    userAgentName: [
      userAgentInfo.user.name,
      userAgentInfo.user.surnames,
      userAgentInfo.user.secondSurname,
    ]
      .filter((item) => !_.isEmpty(item))
      .join(' '),
  };
}

async function handleUsersInProgram({ report, program, ctx }) {
  const usersInProgram = await ctx.tx.call('academic-portfolio.programs.getUsersInProgram', {
    program: program.id,
    course: report.course || program.courses[0].id,
    onlyStudents: true,
  });
  return usersInProgram?.length;
}

async function handleClasses({ program, course, courseDates, ctx }) {
  let classesIds = null;
  if (course) {
    classesIds = await ctx.tx.call('academic-portfolio.classes.getClassesUnderProgramCourse', {
      program: program.id,
      course: course.id,
    });
  } else {
    classesIds = await ctx.tx.call('academic-portfolio.classes.getClassesUnderProgram', {
      program: program.id,
    });
  }

  let classVideoN = 0;

  if (courseDates?.startDate && courseDates?.endDate) {
    const classes = await ctx.tx.call('academic-portfolio.classes.classByIds', {
      ids: classesIds,
    });
    _.forEach(classes, (classe) => {
      _.forEach(classe.schedule, ({ dayWeek }) => {
        classVideoN += getDaysBetweenDates(
          new Date(courseDates.startDate),
          new Date(courseDates.endDate),
          dayWeek
        ).length;
      });
    });
  }

  return { classesIds, classVideoN };
}

async function handleXAPIInteractions({ report, program, classesIds, ctx }) {
  const [xapiVirtualClass, xapiProgramViewDates, xapiLeebraryMediaFiles] = await Promise.all([
    ctx.tx.call(XAPI_FIND_ENDPOINT, {
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
    ctx.tx.call(XAPI_FIND_ENDPOINT, {
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
    ctx.tx.call(XAPI_FIND_ENDPOINT, {
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
  ]);

  const mediaFiles = [];
  _.forEach(xapiLeebraryMediaFiles, (item) => {
    const index = _.findIndex(mediaFiles, {
      id: item.statement.object.definition.extensions.id,
    });
    if (index < 0) {
      mediaFiles.push({
        id: item.statement.object.definition.extensions.id,
        name: item.statement.object.definition.extensions.name,
        first: item.createdAt,
        last: item.createdAt,
      });
    } else {
      mediaFiles[index].last = item.createdAt;
    }
  });

  const virtualClassClicks = [];
  _.forEach(xapiVirtualClass, (item) => {
    virtualClassClicks.push({
      name: item.statement.object.definition.extensions.name,
      date: item.createdAt,
      url: item.statement.object.definition.extensions.url,
    });
  });

  const connections = [];
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
          // If there is a next item, we need to check if it is a termination. If it is not, we generate the termination ourselves 15 minutes later (Something failed and was not recorded)
          if (nextItem.statement.verb.id === XAPIVerbs.TERMINATED.id) {
            con.end = nextItem.createdAt;
            indexsUsed.push(index + 1);
          } else {
            // TODO store these to process later, checking that they are not already within any other date ranges.
            const date = new Date(item.createdAt);
            date.setMinutes(date.getMinutes() + 15);
            con.end = date;
          }
        } else {
          // If there is no next item, it means it is currently inside and has not exited, we do nothing and do not register it
        }
      }
      if (con.start && con.end) {
        const s = DateTime.fromJSDate(con.start);
        const e = DateTime.fromJSDate(con.end);
        const diff = e.diff(s, ['hours', 'minutes', 'seconds']);
        const diffSeconds = e.diff(s, ['seconds']);
        connections.push({
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

  return {
    mediaFiles,
    virtualClassClicks,
    connections,
  };
}

async function handleAssignablesData({ report, program, classesIds, ctx }) {
  const assignablesData = await ctx.tx.call('assignables.assignations.getUserDataForFundae', {
    userAgent: report.userAgent,
    classes: classesIds,
  });

  let evaluationSystem = null;
  try {
    evaluationSystem = await ctx.call('academic-portfolio.programs.getProgramEvaluationSystem', {
      id: program.id,
    });
  } catch (e) {
    console.error(e);
  }

  const exams = {};

  _.forEach(assignablesData.gradables, (exam, index) => {
    _.forEach(exam.subjects, (subjectId) => {
      if (!exams[subjectId])
        exams[subjectId] = {
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
          grade && evaluationSystem ? getGradeAsText(grade.grade, evaluationSystem) : null,
        status: !!exam.endDate,
        deliveredOn: exam.endDate?.date || null,
        evaluatedOn: grade ? grade.date : null,
      };
      exams[subjectId].items.push(data);
    });
  });

  const teachersInClasses = await ctx.tx.call('academic-portfolio.classes.teacherGetByClass', {
    classe: classesIds,
    type: 'main-teacher',
    returnIds: true,
  });

  return {
    exams,
    examsPlatform: assignablesData.gradables.length,
    lessonsPlatfom: assignablesData.noGradables.length,
    examsPerformed: `${
      (assignablesData.endDatesGradables.length / assignablesData.gradables.length) * 100
    }% (${assignablesData.endDatesGradables.length}/${assignablesData.gradables.length})`,
    lessonsPerformed: `${
      (assignablesData.endDatesNoGradables.length / assignablesData.noGradables.length) * 100
    }% (${assignablesData.endDatesNoGradables.length}/${assignablesData.noGradables.length})`,
    totalPerformed: `${
      ((assignablesData.endDatesNoGradables.length + assignablesData.endDatesGradables.length) /
        (assignablesData.noGradables.length + assignablesData.gradables.length)) *
      100
    }% (${assignablesData.endDatesNoGradables.length + assignablesData.endDatesGradables.length}/${
      assignablesData.noGradables.length + assignablesData.gradables.length
    })`,
    nTeachers: teachersInClasses.length,
  };
}

async function handleComunica({ report, ctx }) {
  const userAgentRooms = await ctx.tx.call('comunica.room.getUserAgentRooms', {
    userAgent: report.userAgent,
  });

  const roomsPromises = [];
  const roomMessagesPromises = [];
  _.forEach(userAgentRooms, (room) => {
    roomsPromises.push(
      ctx.tx.call('comunica.room.get', {
        key: room,
        userAgent: report.userAgent,
        returnUserAgents: true,
      })
    );
    roomMessagesPromises.push(
      ctx.tx.call('comunica.room.getMessages', {
        key: room,
        userAgent: report.userAgent,
      })
    );
  });

  const [rooms, roomMessages] = await Promise.all([
    Promise.all(roomsPromises),
    Promise.all(roomMessagesPromises),
  ]);

  const privateChats = [];
  let nMessagesSend = 0;
  let nMessagesReceived = 0;

  _.forEach(rooms, (room, index) => {
    // Chats privados
    if (room.messages && room.userAgents.length === 2) {
      const privateChat = {
        ...room,
        userAgents: _.keyBy(_.map(room.userAgents, 'userAgent'), 'id'),
        messages: [],
      };
      _.forEach(roomMessages[index], (message) => {
        if (message.userAgent === report.userAgent) {
          nMessagesSend++;
        } else {
          nMessagesReceived++;
        }
        privateChat.messages.push({
          createdAt: message.createdAt,
          userAgent: message.userAgent,
          message: message.message,
          id: message.id,
        });
      });
      privateChats.push(privateChat);
    }
  });

  return {
    privateChats,
    nMessagesSend,
    nMessagesReceived,
  };
}

/**
 * Initializes and starts the report generation process.
 *
 * @param {object} params - The parameters required for report generation.
 * @param {object} params.report - The report object containing necessary report details.
 * @param {object} params.dataToSocket - Object to manage real-time data transmission via web sockets.
 * @param {MoleculerContext} params.ctx - The Moleculer service context for database and service interaction.
 */
async function startGeneration({ report, dataToSocket, ctx }) {
  try {
    const { toSave, course, courseIsAlone, program } = await initializeReportData({ report, ctx });

    await updateReportProgress({ report, percentageCompleted: 5, dataToSocket, ctx });

    const courseDates = await handleCourseDates({ program, course, courseIsAlone, toSave, ctx });

    await updateReportProgress({ report, percentageCompleted: 10, dataToSocket, ctx });

    const userAgentInfo = await handleUserAgentInfo({ report, ctx });
    toSave.userAgentId = userAgentInfo.userAgentId;
    toSave.userAgentEmail = userAgentInfo.userAgentEmail;
    toSave.userAgentName = userAgentInfo.userAgentName;

    await updateReportProgress({ report, percentageCompleted: 20, dataToSocket, ctx });

    const usersInProgram = await handleUsersInProgram({ report, program, ctx });
    toSave.usersInProgram = usersInProgram;

    const { classesIds, classVideoN } = await handleClasses({ program, course, courseDates, ctx });
    toSave.classVideoN = classVideoN;

    await updateReportProgress({ report, percentageCompleted: 35, dataToSocket, ctx });

    const { mediaFiles, virtualClassClicks, connections } = await handleXAPIInteractions({
      report,
      program,
      classesIds,
      ctx,
    });

    toSave.mediaFiles = mediaFiles;
    toSave.virtualClassClicks = virtualClassClicks;
    toSave.connections = connections;
    toSave.firstConnection = connections[0]?.start;
    toSave.lastConnection = connections[connections.length - 1]?.end;
    toSave.totalHoursConnected = 0;
    _.forEach(connections, ({ timeInSeconds }) => {
      toSave.totalHoursConnected += timeInSeconds;
    });
    toSave.totalHoursConnected = (toSave.totalHoursConnected / 3600).toFixed(2);

    await updateReportProgress({ report, percentageCompleted: 55, dataToSocket, ctx });

    const {
      exams,
      nTeachers,
      examsPlatform,
      lessonsPlatfom,
      examsPerformed,
      lessonsPerformed,
      totalPerformed,
    } = await handleAssignablesData({
      report,
      program,
      classesIds,
      ctx,
    });
    toSave.exams = exams;
    toSave.nTeachers = nTeachers;
    toSave.examsPlatform = examsPlatform;
    toSave.totalExams = examsPlatform;
    toSave.lessonsPlatform = lessonsPlatfom;
    toSave.examsPerformed = examsPerformed;
    toSave.lessonsPerformed = lessonsPerformed;
    toSave.totalPerformed = totalPerformed;

    await updateReportProgress({ report, percentageCompleted: 70, dataToSocket, ctx });

    const { privateChats, nMessagesSend, nMessagesReceived } = await handleComunica({
      report,
      ctx,
    });
    toSave.privateChats = privateChats;
    toSave.nMessagesSend = nMessagesSend;
    toSave.nMessagesReceived = nMessagesReceived;

    await updateReportProgress({ report, percentageCompleted: 85, dataToSocket, ctx });

    await ctx.tx.db.Report.updateOne(
      { id: report.id },
      {
        report: toSave,
      }
    );

    await updateReportProgress({
      report,
      percentageCompleted: 100,
      dataToSocket: { ...dataToSocket, report: toSave },
      ctx,
    });
  } catch (e) {
    console.error(e);
    await updateReportProgress({ report, percentageCompleted: 0, dataToSocket, ctx });
  }
}

/**
 * Retries the report generation process for a given report ID.
 *
 * @param {object} params - The parameters required for retry.
 * @param {string} params.id - The ID of the report to be retried.
 * @param {MoleculerContext} params.ctx - The Moleculer service context for database and service interaction.
 */
async function retry({ id, ctx }) {
  const report = await ctx.tx.db.Report.findOne({ id }).lean();
  const [userAgentInfo] = await ctx.tx.call(USER_AGENT_INFO_ENDPOINT, {
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

/**
 * Generates a report for a given user agent, program, and course.
 *
 * @param {object} params - The parameters required for report generation.
 * @param {string|string[]} params.userAgent - The user agent(s) for which the report is generated.
 * @param {string} params.program - The program ID for the report.
 * @param {string} params.course - The course ID for the report.
 * @param {MoleculerContext} params.ctx - The Moleculer service context for database and service interaction.
 * @returns {Promise<object>} - A Promise that resolves to the generated report object.
 */
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
  const [userAgentInfo] = await ctx.tx.call(USER_AGENT_INFO_ENDPOINT, {
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
