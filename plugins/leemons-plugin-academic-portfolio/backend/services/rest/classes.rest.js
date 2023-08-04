/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const _ = require('lodash');
const { haveClasses, addClass, updateClass } = require('../../core/classes');
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
      const _class = await addClass(data, { userSession: ctx.state.userSession });
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
      const _class = await updateClass(data, { userSession: ctx.state.userSession });
      return { status: 200, class: _class };
    },
  },
};
