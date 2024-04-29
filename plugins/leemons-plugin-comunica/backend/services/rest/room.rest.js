/* eslint-disable no-console */
/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

const _ = require('lodash');
const { LeemonsValidator } = require('@leemons/validator');
const {
  LeemonsMiddlewareAuthenticated,
  LeemonsMiddlewareNecessaryPermits,
} = require('@leemons/middlewares');
const { randomString } = require('@leemons/utils');
const { LeemonsError } = require('@leemons/error');
const {
  getUserAgentRoomsList,
  getMessages,
  sendMessage,
  markAsRead,
  get,
  toggleMutedRoom,
  toggleAdminMutedRoom,
  toggleDisableRoom,
  adminRemoveUserAgents,
  adminUpdateRoomName,
  adminAddUserAgents,
  adminRemoveRoom,
  add,
  adminChangeRoomImage,
  toggleAttachedRoom,
  getUnreadMessages,
  getRoomsMessageCount,
} = require('../../core/room');

const getRoomListRest = require('./openapi/room/getRoomListRest');
const getMessagesRest = require('./openapi/room/getMessagesRest');
const sendMessageRest = require('./openapi/room/sendMessageRest');
const markMessagesAsReadRest = require('./openapi/room/markMessagesAsReadRest');
const getRoomRest = require('./openapi/room/getRoomRest');
const toggleMutedRoomRest = require('./openapi/room/toggleMutedRoomRest');
const toggleAdminMutedRoomRest = require('./openapi/room/toggleAdminMutedRoomRest');
const toggleAdminDisableRoomRest = require('./openapi/room/toggleAdminDisableRoomRest');
const adminRemoveUserAgentRest = require('./openapi/room/adminRemoveUserAgentRest');
const adminUpdateRoomNameRest = require('./openapi/room/adminUpdateRoomNameRest');
const adminAddUsersToRoomRest = require('./openapi/room/adminAddUsersToRoomRest');
const adminRemoveRoomRest = require('./openapi/room/adminRemoveRoomRest');
const createRoomRest = require('./openapi/room/createRoomRest');
const adminChangeRoomImageRest = require('./openapi/room/adminChangeRoomImageRest');
const toggleAttachedRoomRest = require('./openapi/room/toggleAttachedRoomRest');
const getUnreadMessagesRest = require('./openapi/room/getUnreadMessagesRest');
const getRoomsMessageCountRest = require('./openapi/room/getRoomsMessageCountRest');
/** @type {ServiceSchema} */
module.exports = {
  getRoomListRest: {
    openapi: getRoomListRest.openapi,
    rest: {
      path: '/list',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const rooms = await getUserAgentRoomsList({
        userAgent: ctx.meta.userSession.userAgents[0].id,
        ctx,
      });
      return { status: 200, rooms };
    },
  },
  getMessagesRest: {
    openapi: getMessagesRest.openapi,
    rest: {
      path: '/:key/messages',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const messages = await getMessages({
        ...ctx.params,
        userAgent: ctx.meta.userSession.userAgents[0].id,
        ctx,
      });
      return { status: 200, messages };
    },
  },
  sendMessageRest: {
    openapi: sendMessageRest.openapi,
    rest: {
      path: '/:key/messages',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      await sendMessage({
        ...ctx.params,
        userAgent: ctx.meta.userSession.userAgents[0],
        ctx,
      });
      return { status: 200 };
    },
  },
  markMessagesAsReadRest: {
    openapi: markMessagesAsReadRest.openapi,
    rest: {
      path: '/:key/messages/read',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      await markAsRead({
        ...ctx.params,
        userAgentId: ctx.meta.userSession.userAgents[0].id,
        ctx,
      });
      return { status: 200 };
    },
  },
  getRoomRest: {
    openapi: getRoomRest.openapi,
    rest: {
      path: '/:key',
      method: 'GET',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const room = await get({
        ...ctx.params,
        userAgent: ctx.meta.userSession.userAgents[0].id,
        ctx,
      });
      return { status: 200, room };
    },
  },
  toggleMutedRoomRest: {
    openapi: toggleMutedRoomRest.openapi,
    rest: {
      path: '/:key/mute',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const muted = await toggleMutedRoom({
        ...ctx.params,
        userAgent: ctx.meta.userSession.userAgents[0].id,
        ctx,
      });
      return { status: 200, muted };
    },
  },
  toggleAdminMutedRoomRest: {
    openapi: toggleAdminMutedRoomRest.openapi,
    rest: {
      path: '/:key/admin/mute',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const attached = await toggleAdminMutedRoom({
        ...ctx.params,
        userAgentAdmin: ctx.meta.userSession.userAgents[0].id,
        ctx,
      });
      return { status: 200, attached };
    },
  },
  toggleAdminDisableRoomRest: {
    openapi: toggleAdminDisableRoomRest.openapi,
    rest: {
      path: '/:key/admin/disable',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const adminDisableMessages = await toggleDisableRoom({
        ...ctx.params,
        userAgent: ctx.meta.userSession.userAgents[0].id,
        ctx,
      });
      return { status: 200, adminDisableMessages };
    },
  },
  adminRemoveUserAgentRest: {
    openapi: adminRemoveUserAgentRest.openapi,
    rest: {
      path: '/:key/admin/remove',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      await adminRemoveUserAgents({
        ...ctx.params,
        userAgents: ctx.params.userAgent,
        userAgentAdmin: ctx.meta.userSession.userAgents[0].id,
        ctx,
      });
      return { status: 200 };
    },
  },
  adminUpdateRoomNameRest: {
    openapi: adminUpdateRoomNameRest.openapi,
    rest: {
      path: '/:key/admin/name',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const room = await adminUpdateRoomName({
        ...ctx.params,
        userAgent: ctx.meta.userSession.userAgents[0].id,
        ctx,
      });
      return { status: 200, room };
    },
  },
  adminAddUsersToRoomRest: {
    openapi: adminAddUsersToRoomRest.openapi,
    rest: {
      path: '/:key/admin/users',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const userAgents = await adminAddUserAgents({
        ...ctx.params,
        userAgentAdmin: ctx.meta.userSession.userAgents[0].id,
        ctx,
      });
      return { status: 200, userAgents };
    },
  },
  adminRemoveRoomRest: {
    openapi: adminRemoveRoomRest.openapi,
    rest: {
      path: '/:key/admin/remove',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      await adminRemoveRoom({
        ...ctx.params,
        userAgentAdmin: ctx.meta.userSession.userAgents[0].id,
        ctx,
      });
      return { status: 200 };
    },
  },
  createRoomRest: {
    openapi: createRoomRest.openapi,
    rest: {
      path: '/create',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      let key = null;
      if (ctx.params.type === 'group') {
        key = `leemons.comunica.room.group.${randomString()}`;
      } else if (ctx.params.type === 'chat') {
        key = `leemons.comunica.room.chat.${randomString()}`;
      } else {
        throw new LeemonsError(ctx, { message: 'Type not allowed' });
      }
      const room = await add({
        ...ctx.params,
        key,
        adminUserAgents:
          ctx.params.type === 'chat'
            ? []
            : ctx.meta.userSession.userAgents[0].id,
        ctx,
      });

      return { status: 200, room };
    },
  },
  adminChangeRoomImageRest: {
    openapi: adminChangeRoomImageRest.openapi,
    rest: {
      path: '/:key/admin/image',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const { key, image: avatar } = ctx.params;
      const room = await adminChangeRoomImage({
        key,
        avatar,
        ctx,
      });
      return { status: 200, room };
    },
  },
  toggleAttachedRoomRest: {
    openapi: toggleAttachedRoomRest.openapi,
    rest: {
      path: '/:key/attach',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const attached = await toggleAttachedRoom({
        ...ctx.params,
        userAgent: ctx.meta.userSession.userAgents[0].id,
        ctx,
      });
      return { status: 200, attached };
    },
  },
  getUnreadMessagesRest: {
    openapi: getUnreadMessagesRest.openapi,
    rest: {
      path: '/messages/unread',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const count = await getUnreadMessages({
        ...ctx.params,
        userAgent: ctx.meta.userSession.userAgents[0].id,
        ctx,
      });
      return { status: 200, count };
    },
  },
  getRoomsMessageCountRest: {
    openapi: getRoomsMessageCountRest.openapi,
    rest: {
      path: '/messages/count',
      method: 'POST',
    },
    middlewares: [LeemonsMiddlewareAuthenticated()],
    async handler(ctx) {
      const count = await getRoomsMessageCount({
        ...ctx.params,
        userAgent: ctx.meta.userSession.userAgents[0].id,
        ctx,
      });
      return { status: 200, count };
    },
  },
};
