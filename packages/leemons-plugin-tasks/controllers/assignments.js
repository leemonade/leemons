const createInstance = require('../src/services/assignment/instance/create');
const removeInstance = require('../src/services/assignment/instance/remove');
const { get: getInstance } = require('../src/services/assignment/instance/get');

const assignStudent = require('../src/services/assignment/student/assign');
const unassignStudent = require('../src/services/assignment/student/remove');
const listStudents = require('../src/services/assignment/student/list');
const listAssignedStudents = require('../src/services/assignment/student/listAssigned');

const assignTeacher = require('../src/services/assignment/teacher/assign');
const unassignTeacher = require('../src/services/assignment/teacher/remove');
const listTeachers = require('../src/services/assignment/teacher/listTeachers');
const listAssignedTeacher = require('../src/services/assignment/teacher/listAssigned');
const updateStudent = require('../src/services/assignment/student/update');
const searchTeachers = require('../src/services/assignment/teacher/search');
const assignGroup = require('../src/services/assignment/groups/add');
const calificateStudent = require('../src/services/assignment/student/calificate');
const getStudentCalification = require('../src/services/assignment/student/getCalification');
const updateInstance = require('../src/services/assignment/instance/update');
const setDeliverable = require('../src/services/assignment/student/deliverable/set');
const getDeliverable = require('../src/services/assignment/student/deliverable/get');
const searchInstance = require('../src/services/assignment/instance/search');

module.exports = {
  /**
   * Instances
   */
  instanceCreate: async (ctx) => {
    try {
      const { task } = ctx.request.params;
      const instanceData = ctx.request.body;

      const instance = await createInstance(
        {
          task,
          ...instanceData,
        },
        { userSession: ctx.state.userSession, ctx }
      );

      ctx.status = 201;
      ctx.body = {
        status: 201,
        instance,
      };
    } catch (e) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        message: e.message,
      };
    }
  },
  instanceUpdate: async (ctx) => {
    try {
      const { instance } = ctx.request.params;
      const {
        startDate,
        deadline,
        visualizationDate,
        executionTime,
        alwaysOpen,
        closeDate,
        message,
        showCurriculum,
      } = ctx.request.body;

      const instanceUpdated = await updateInstance({
        instance,
        startDate,
        deadline,
        visualizationDate,
        executionTime,
        alwaysOpen,
        closeDate,
        message,
        showCurriculum,
      });

      ctx.status = 200;
      ctx.body = {
        status: 200,
        instance: instanceUpdated,
      };
    } catch (e) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        message: e.message,
      };
    }
  },
  instanceGet: async (ctx) => {
    try {
      const { instance } = ctx.request.params;
      // let { columns } = ctx.query;

      // try {
      //   columns = JSON.parse(columns);
      // } catch (e) {
      //   if (columns !== '*') {
      //     columns = undefined;
      //   }
      // }

      const data = await getInstance(instance, {
        userSession: ctx.state.userSession,
      });

      ctx.status = 200;
      ctx.body = {
        status: 200,
        data,
      };
    } catch (e) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        message: e.message,
      };
    }
  },
  instanceDelete: async (ctx) => {
    try {
      const { task, instance } = ctx.request.params;

      const deleted = await removeInstance(task, instance);

      ctx.status = 200;
      ctx.body = {
        status: 200,
        ...deleted,
      };
    } catch (e) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        message: e.message,
      };
    }
  },
  search: async (ctx) => {
    try {
      const { offset, size, ...query } = ctx.request.query;

      const data = await searchInstance(
        ctx.state.userSession.userAgents,
        {
          ...query,
        },
        parseInt(offset, 10) || 0,
        parseInt(size, 10) || 10
      );

      ctx.status = 200;
      ctx.body = {
        status: 200,
        data,
      };
    } catch (e) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        message: e.message,
      };
    }
  },

  /**
   * Students
   */
  studentAssign: async (ctx) => {
    try {
      const { instance } = ctx.request.params;
      const { student } = ctx.request.body;

      const assigned = await assignStudent(instance, student);

      ctx.status = 201;
      ctx.body = {
        status: 201,
        ...assigned,
      };
    } catch (e) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        message: e.message,
      };
    }
  },
  studentUnassign: async (ctx) => {
    try {
      const { instance, student } = ctx.request.params;

      const unassigned = await unassignStudent(instance, student);

      ctx.status = 200;
      ctx.body = {
        status: 200,
        ...unassigned,
      };
    } catch (e) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        message: e.message,
      };
    }
  },
  studentListAssigned: async (ctx) => {
    try {
      const { user } = ctx.request.params;
      const { page, size, details } = ctx.request.query;

      const tasks = await listAssignedStudents(
        user,
        parseInt(page, 10) || 0,
        parseInt(size, 10) || 20,
        {
          details: details === 'true',
        }
      );

      ctx.status = 200;
      ctx.body = {
        status: 200,
        tasks,
      };
    } catch (e) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        message: e.message,
      };
    }
  },
  studentList: async (ctx) => {
    try {
      const { instance } = ctx.request.params;
      const { page, size } = ctx.request.query;

      const students = await listStudents(
        instance,
        parseInt(page, 10) || undefined,
        parseInt(size, 10) || undefined
      );

      ctx.status = 200;
      ctx.body = {
        status: 200,
        students,
      };
    } catch (e) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        message: e.message,
      };
    }
  },
  studentUpdate: async (ctx) => {
    try {
      const { instance, student } = ctx.request.params;
      const { body } = ctx.request;

      const updated = await updateStudent(
        { instance, student, ...body },
        { userSession: ctx.state.userSession }
      );

      ctx.status = 200;
      ctx.body = {
        status: 200,
        updated,
      };
    } catch (e) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        message: e.message,
      };
    }
  },
  studentCalificate: async (ctx) => {
    const { instance, student } = ctx.request.params;
    const { grade, teacherFeedback } = ctx.request.body;

    const calificated = await calificateStudent(instance, student, grade, teacherFeedback);

    ctx.status = 200;
    ctx.body = {
      status: 200,
      calificated,
    };
  },
  studentGetCalification: async (ctx) => {
    const { instance, student } = ctx.request.params;

    const calification = await getStudentCalification(instance, student);

    ctx.status = 200;
    ctx.body = {
      status: 200,
      calification,
    };
  },

  /**
   * Teachers
   */
  teacherAssign: async (ctx) => {
    try {
      const { instance } = ctx.request.params;
      const { teacher } = ctx.request.body;

      const assigned = await assignTeacher(instance, teacher);

      ctx.status = 201;
      ctx.body = {
        status: 201,
        ...assigned,
      };
    } catch (e) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        message: e.message,
      };
    }
  },
  teacherUnassign: async (ctx) => {
    try {
      const { instance, teacher } = ctx.request.params;

      const unassigned = await unassignTeacher(instance, teacher);

      ctx.status = 200;
      ctx.body = {
        status: 200,
        ...unassigned,
      };
    } catch (e) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        message: e.message,
      };
    }
  },
  teacherListAssigned: async (ctx) => {
    try {
      const { user } = ctx.request.params;
      const { page, size, details } = ctx.request.query;
      let { columns } = ctx.request.query;

      try {
        columns = JSON.parse(columns);
      } catch (e) {
        if (columns !== '*') {
          columns = undefined;
        }
      }

      const tasks = await listAssignedTeacher(
        user,
        parseInt(page, 10) || 0,
        parseInt(size, 10) || 10,
        {
          details: details === 'true',
          columns,
        }
      );

      ctx.status = 200;
      ctx.body = {
        status: 200,
        tasks,
      };
    } catch (e) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        message: e.message,
      };
    }
  },
  teacherSearch: async (ctx) => {
    try {
      const { user } = ctx.request.params;
      const { offset, size, ...query } = ctx.request.query;

      const data = await searchTeachers(
        {
          ...query,
          teacher: user,
        },
        parseInt(offset, 10) || 0,
        parseInt(size, 10) || 10
      );

      ctx.status = 200;
      ctx.body = {
        status: 200,
        data,
      };
    } catch (e) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        message: e.message,
      };
    }
  },
  teacherList: async (ctx) => {
    try {
      const { instance } = ctx.request.params;
      const { page, size } = ctx.request.query;

      const students = await listTeachers(instance, parseInt(page, 10), parseInt(size, 10));

      ctx.status = 200;
      ctx.body = {
        status: 200,
        students,
      };
    } catch (e) {
      ctx.status = 400;
      ctx.body = {
        status: 400,
        message: e.message,
      };
    }
  },

  /**
   * Groups
   */
  groupAssign: async (ctx) => {
    const { instance } = ctx.request.params;
    const { groups } = ctx.request.body;

    const result = await assignGroup(instance, groups);

    ctx.status = 200;
    ctx.body = {
      status: 200,
      ...result,
    };
  },

  /**
   * User Deliverables
   */
  setDeliverable: async (ctx) => {
    const { instance, user, type } = ctx.request.params;
    const { deliverable } = ctx.request.body;

    const result = await setDeliverable({ instance, user, type, deliverable });

    ctx.status = 200;
    ctx.body = {
      status: 200,
      ...result,
    };
  },

  getDeliverable: async (ctx) => {
    const { instance, user, type } = ctx.request.params;

    const result = await getDeliverable({ instance, user, type });

    ctx.status = 200;
    ctx.body = {
      status: 200,
      ...result,
    };
  },
};
