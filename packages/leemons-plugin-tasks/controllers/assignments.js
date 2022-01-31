const createInstance = require('../src/services/assignment/instance/create');
const removeInstance = require('../src/services/assignment/instance/remove');

const assignStudent = require('../src/services/assignment/student/assign');
const listStudents = require('../src/services/assignment/student/list');

const assignTeacher = require('../src/services/assignment/teacher/assign');
const listTeachers = require('../src/services/assignment/teacher/list');

module.exports = {
  /**
   * Instances
   */
  instanceCreate: async (ctx) => {
    try {
      const { task } = ctx.request.params;

      const instance = await createInstance(task);

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
  studentList: async (ctx) => {
    try {
      const { instance } = ctx.request.params;
      const { page, size } = ctx.request.query;

      const students = await listStudents(instance, parseInt(page, 10), parseInt(size, 10));

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
};
