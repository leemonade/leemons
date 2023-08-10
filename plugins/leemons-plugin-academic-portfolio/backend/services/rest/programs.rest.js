/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const _ = require('lodash');
const { LeemonsError } = require('leemons-error');
const { LeemonsValidator } = require('leemons-validator');

const { getProgramTree } = require('../../core/programs/getProgramTree');
const { havePrograms } = require('../../core/programs/havePrograms');
const { addProgram } = require('../../core/programs/addProgram');
const { listPrograms } = require('../../core/programs/listPrograms');
const { programsByIds } = require('../../core/programs/programsByIds');
const { updateProgram } = require('../../core/programs/updateProgram');
const { getProgramCourses } = require('../../core/programs/getProgramCourses');
const { getProgramGroups } = require('../../core/programs/getProgramGroups');
const { getProgramSubstages } = require('../../core/programs/getProgramSubstages');
const { removeProgramByIds } = require('../../core/programs/removeProgramByIds');
const { duplicateProgramByIds } = require('../../core/programs/duplicateProgramByIds');
const {
  addStudentsToClassesUnderNodeTree,
} = require('../../core/programs/addStudentsToClassesUnderNodeTree');
const { getUserPrograms } = require('../../core/programs/getUserPrograms');
const { getProgramEvaluationSystem } = require('../../core/programs/getProgramEvaluationSystem');

/** @type {ServiceSchema} */
module.exports = {
  getProgramTreeRest: {
    rest: {
      path: '/program/:id/tree',
      method: 'GET',
    },
    async handler(ctx) {
      const tree = await getProgramTree({ programId: ctx.params.id, ctx });
      return { status: 200, tree };
    },
  },
  haveProgramsRest: {
    rest: {
      path: '/program/have',
      method: 'GET',
    },
    async handler(ctx) {
      const have = await havePrograms({ ctx });
      return { status: 200, have };
    },
  },
  postProgramRest: {
    rest: {
      path: '/program',
      method: 'POST',
    },
    async handler(ctx) {
      const data = JSON.parse(ctx.params.data);
      _.forIn(ctx.params.files, (value, key) => {
        _.set(data, key, value);
      });
      const program = await addProgram({ data, userSession: ctx.state.userSession, ctx });
      return { status: 200, program };
    },
  },
  putProgramRest: {
    rest: {
      path: '/program',
      method: 'PUT',
    },
    async handler(ctx) {
      const data = JSON.parse(ctx.params.data);
      _.forIn(ctx.params.files, (value, key) => {
        _.set(data, key, value);
      });
      const program = await updateProgram({ data, ctx });
      return { status: 200, program };
    },
  },
  listProgramRest: {
    rest: {
      path: '/program',
      method: 'GET',
    },
    async handler(ctx) {
      const validator = new LeemonsValidator({
        type: 'object',
        properties: {
          page: { type: ['number', 'string'] },
          size: { type: ['number', 'string'] },
          center: { type: ['string'] },
        },
        required: ['page', 'size'],
        additionalProperties: false,
      });

      if (validator.validate(ctx.params)) {
        const { page, size, center, ...options } = ctx.params;
        const data = await listPrograms({
          page: parseInt(page, 10),
          size: parseInt(size, 10),
          center,
          ...options,
          ctx,
        });
        return { status: 200, data };
      }

      throw validator.error;
    },
  },
  detailProgramRest: {
    rest: {
      path: '/program/:id',
      method: 'GET',
    },
    async handler(ctx) {
      const [program] = await programsByIds({ ids: ctx.params.id, ctx });
      if (!program) throw new LeemonsError(ctx, { message: 'Program not found' });
      return { status: 200, program };
    },
  },
  programHasCoursesRest: {
    rest: {
      path: '/program/:id/has/courses',
      method: 'GET',
    },
    async handler(ctx) {
      const courses = await getProgramCourses({ ids: ctx.params.id, ctx });
      return { status: 200, has: courses.length > 0 };
    },
  },
  programHasGroupsRest: {
    rest: {
      path: '/program/:id/has/groups',
      method: 'GET',
    },
    async handler(ctx) {
      const groups = await getProgramGroups({ ids: ctx.params.id, ctx });
      return { status: 200, has: groups.length > 0 };
    },
  },
  programHasSubstagesRest: {
    rest: {
      path: '/program/:id/has/substages',
      method: 'GET',
    },
    async handler(ctx) {
      const substages = await getProgramSubstages({ ids: ctx.params.id, ctx });
      return { status: 200, has: substages.length > 0 };
    },
  },
  programCoursesRest: {
    rest: {
      path: '/program/:id/courses',
      method: 'GET',
    },
    async handler(ctx) {
      const courses = await getProgramCourses({ ids: ctx.params.id, ctx });
      return { status: 200, courses };
    },
  },
  programGroupsRest: {
    rest: {
      path: '/program/:id/groups',
      method: 'GET',
    },
    async handler(ctx) {
      const groups = await getProgramGroups({ ids: ctx.params.id, ctx });
      return { status: 200, groups };
    },
  },
  programSubstagesRest: {
    rest: {
      path: '/program/:id/substages',
      method: 'GET',
    },
    async handler(ctx) {
      const substages = await getProgramSubstages({ ids: ctx.params.id, ctx });
      return { status: 200, substages };
    },
  },
  deleteProgramRest: {
    rest: {
      path: '/program/:id',
      method: 'DELETE',
    },
    async handler(ctx) {
      await removeProgramByIds({
        ids: ctx.params.id,
        soft: ctx.params.soft === 'true',
        ctx,
      });
      return { status: 200 };
    },
  },
  duplicateProgramRest: {
    rest: {
      path: '/program/:id/duplicate',
      method: 'POST',
    },
    async handler(ctx) {
      const [program] = await duplicateProgramByIds({ ids: ctx.params.id, ctx });
      return { status: 200, program };
    },
  },
  addStudentsToClassesUnderNodeTreeRest: {
    rest: {
      path: '/program/add-students-to-classes-under-node-tree',
      method: 'POST',
    },
    async handler(ctx) {
      const data = await addStudentsToClassesUnderNodeTree({
        program: ctx.params.program,
        nodetype: ctx.params.nodeType,
        nodeId: ctx.params.nodeId,
        students: ctx.params.students,
        ctx,
      });
      return { status: 200, data };
    },
  },
  getUserProgramsRest: {
    rest: {
      path: '/user/programs',
      method: 'GET',
    },
    async handler(ctx) {
      const programs = await getUserPrograms({ ctx });
      return { status: 200, programs };
    },
  },
  getProgramEvaluationSystemRest: {
    rest: {
      path: '/program/:id/evaluation-system',
      method: 'GET',
    },
    async handler(ctx) {
      const evaluationSystem = await getProgramEvaluationSystem({ id: ctx.params.id, ctx });
      return { status: 200, evaluationSystem };
    },
  },
};
