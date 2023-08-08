/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const _ = require('lodash');
const { LeemonsValidator } = require('leemons-validator');

const { haveClasses } = require('../../core/classes/haveClasses');
const { addClass } = require('../../core/classes/addClass');
const { updateClass } = require('../../core/classes/updateClass');
const { updateClassMany } = require('../../core/classes/updateClassMany');
const { addInstanceClass } = require('../../core/classes/addInstanceClass');
const { listClasses } = require('../../core/classes/listClasses');

/** @type {ServiceSchema} */
module.exports = {
  haveClassesRest: {
    rest: {
      path: '/classes/have',
      method: 'GET',
    },
    async handler(ctx) {
      const have = await haveClasses({ ctx });
      return { status: 200, have };
    },
  },
  postClassRest: {
    rest: {
      path: '/class',
      method: 'POST',
    },
    async handler(ctx) {
      const data = JSON.parse(ctx.params.data);
      _.forIn(ctx.params.files, (value, key) => {
        _.set(data, key, value);
      });
      const _class = await addClass({ data, ctx });
      return { status: 200, class: _class };
    },
  },
  putClassRest: {
    rest: {
      path: '/class',
      method: 'PUT',
    },
    async handler(ctx) {
      const data = JSON.parse(ctx.params.data);
      _.forIn(ctx.params.files, (value, key) => {
        _.set(data, key, value);
      });
      const _class = await updateClass({ data, ctx });
      return { status: 200, class: _class };
    },
  },
  putClassManyRest: {
    rest: {
      path: '/class/many',
      method: 'PUT',
    },
    async handler(ctx) {
      const classes = await updateClassMany({ data: ctx.params.data, ctx });
      return { status: 200, classes };
    },
  },
  postClassInstanceRest: {
    rest: {
      path: '/class/instance',
      method: 'POST',
    },
    async handler(ctx) {
      const _class = await addInstanceClass({ data: ctx.request.body, ctx });
      return { status: 200, class: _class };
    },
  },
  listClassRest: {
    rest: {
      path: '/class',
      method: 'GET',
    },
    async handler(ctx) {
      const validator = new LeemonsValidator({
        type: 'object',
        properties: {
          page: { type: ['number', 'string'] },
          size: { type: ['number', 'string'] },
          program: { type: 'string' },
        },
        required: ['page', 'size', 'program'],
        additionalProperties: false,
      });
      if (validator.validate(ctx.params.query)) {
        const { page, size, program, ...options } = ctx.params.query; // TODO @ask Confirmar que: ctx.request.query === ctx.params.query
        const data = await listClasses({
          page: parseInt(page, 10),
          size: parseInt(size, 10),
          program,
          query: {
            ...options,
          },
          ctx,
        });
        return { status: 200, data };
      }
      throw validator.error;
    },
  },
};
