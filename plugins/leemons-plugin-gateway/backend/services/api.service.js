const ApiGateway = require('moleculer-web');
const { parse } = require('url');
const { LeemonsDeploymentManagerMixin } = require('@leemons/deployment-manager');
const restActions = require('./rest/api.rest');

// async function dumpCollections(database) {
//   // Obtener todas las colecciones
//   const collections = await database.listCollections().toArray();

//   const dump = {};

//   const promises = collections.map(async (collection) => {
//     const documents = await mongoose.connection.collection(collection.name).find({}).toArray();
//     dump[collection.name] = documents;
//   });
//   await Promise.all(promises);

//   // Escribir el dump en un archivo JSON
//   await fs.writeFileSync('./dump.json', JSON.stringify(dump, null, 2));
// }

/**
 * @typedef {import('moleculer').ServiceSchema} ServiceSchema Moleculer's Service Schema
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * @typedef {import('http').IncomingMessage} IncomingRequest Incoming HTTP Request
 * @typedef {import('http').ServerResponse} ServerResponse HTTP Server Response
 * @typedef {import('moleculer-web').ApiSettingsSchema} ApiSettingsSchema API Setting Schema
 */
// ad
module.exports = {
  name: 'gateway',
  mixins: [
    ApiGateway,
    LeemonsDeploymentManagerMixin({ checkIfCanCallMe: false, getDeploymentIdInCall: true }),
  ],

  actions: {
    ...restActions,
  },

  /** @type {ApiSettingsSchema} More info about settings: https://moleculer.services/docs/0.14/moleculer-web.html */
  settings: {
    cors: {
      origin: '*',
    },
    // Exposed port
    port: process.env.PORT || 3000,

    // Exposed IP
    ip: '0.0.0.0',

    // Global Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
    use: [],

    routes: [
      {
        path: '/',
        whitelist: ['**'],
        use: [],
        mergeParams: true,
        authentication: false,
        authorization: false,
        aliases: {
          // -- Gateway (Finish) --
          'GET /status': 'gateway.status',
        },
      },
      {
        path: '/api',

        whitelist: ['**'],

        // Route-level Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
        use: [],

        // Enable/disable parameter merging method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Disable-merging
        mergeParams: true,

        // Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
        authentication: true,

        // Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
        authorization: false,

        // The auto-alias feature allows you to declare your route alias directly in your services.
        // The gateway will dynamically build the full routes from service schema.
        autoAliases: true,

        aliases: {
          // -- Gateway (Finish) --
          'GET status': 'gateway.status',
          'POST database/drop': 'gateway.dropDBRest',

          /*
                                                                                // -- Deployment Manager (Finish) --
                                                                                // 'POST package-manager/info': 'deployment-manager.infoRest',

                                                                                // -- Scorm (Finish) --
                                                                                'POST scorm/tags/list': 'v1.scorm.tags.listTagsRest',
                                                                                'POST scorm/package': 'v1.scorm.package.savePackageRest',
                                                                                'POST scorm/package/duplicate': 'v1.scorm.package.duplicatePackageRest',
                                                                                'POST scorm/package/assign': 'v1.scorm.package.assignPackageRest',
                                                                                'POST scorm/package/share': 'v1.scorm.package.sharePackageRest',
                                                                                'GET scorm/package/supported-versions': 'v1.scorm.package.getSupportedVersionsRest',
                                                                                'GET scorm/package/:id': 'v1.scorm.package.getPackageRest',
                                                                                'DELETE scorm/package/:id': 'v1.scorm.package.deletePackageRest',
                                                                                'PUT scorm/status/:instance/:user': 'v1.scorm.status.updateStatusRest',
                                                                                'GET scorm/assignation/:instance/:user': 'v1.scorm.status.getScormAssignationRest',
                                                                                'GET scorm/public/:filePath(.*)': 'v1.scorm.public.serveFileRest',

                                                                                // -- Learning Paths (Finish) --
                                                                                'POST learning-paths/tags/list': 'v1.learning-paths.tags.listTagsRest',
                                                                                'POST learning-paths/modules': 'v1.learning-paths.modules.createRest',
                                                                                'PUT learning-paths/modules/:id': 'v1.learning-paths.modules.updateRest',
                                                                                'POST learning-paths/modules/:id/duplicate': 'v1.learning-paths.modules.duplicateRest',
                                                                                'DELETE learning-paths/modules/:id': 'v1.learning-paths.modules.removeRest',
                                                                                'POST learning-paths/modules/:id/publish': 'v1.learning-paths.modules.publishRest',
                                                                                'POST learning-paths/modules/:id/assign': 'v1.learning-paths.modules.assignRest',

                                                                                // -- Families Emergency numbers (Finish) --
                                                                                'GET families-emergency-numbers/dataset-form':
                                                                                  'v1.families-emergency-numbers.emergencyPhones.getDatasetFormRest',

                                                                                // -- Families (Finish) --
                                                                                'POST families/search-users': 'v1.families.families.searchUsersRest',
                                                                                'GET families/dataset-form': 'v1.families.families.getDatasetFormRest',
                                                                                'POST families/add': 'v1.families.families.addRest',
                                                                                'POST families/update': 'v1.families.families.updateRest',
                                                                                'GET families/detail/:id': 'v1.families.families.detailRest',
                                                                                'DELETE families/remove/:id': 'v1.families.families.removeRest',
                                                                                'POST families/list': 'v1.families.families.listRest',
                                                                                'GET families/list/detail/page/:user': 'v1.families.families.listDetailPageRest',

                                                                                // -- Scores (Finish) --
                                                                                'POST scores/periods': 'v1.scores.periods.addRest',
                                                                                'GET scores/periods': 'v1.scores.periods.listRest',
                                                                                'DELETE scores/periods/:id': 'v1.scores.periods.removeRest',
                                                                                'GET scores/scores': 'v1.scores.scores.getRest',
                                                                                'PATCH scores/scores': 'v1.scores.scores.setRest',
                                                                                'DELETE scores/scores': 'v1.scores.scores.removeRest',

                                                                                // -- Fundae (Finish) --
                                                                                'POST fundae/report/add': 'v1.fundae.report.generateRest',
                                                                                'POST fundae/report/retry': 'v1.fundae.report.retryRest',
                                                                                'POST fundae/report/list': 'v1.fundae.report.listRest',

                                                                                // -- Feedback (Finish) --
                                                                                'POST feedback/tags/list': 'v1.feedback.tags.listTagsRest',
                                                                                'POST feedback/feedback': 'v1.feedback.feedback.saveFeedbackRest',
                                                                                'GET feedback/feedback/:id': 'v1.feedback.feedback.getFeedbackRest',
                                                                                'DELETE feedback/feedback/:id': 'v1.feedback.feedback.deleteFeedbackRest',
                                                                                'POST feedback/feedback/duplicate': 'v1.feedback.feedback.duplicateFeedbackRest',
                                                                                'POST feedback/feedback/assign': 'v1.feedback.feedback.assignFeedbackRest',
                                                                                'POST feedback/feedback/instance/timestamp':
                                                                                  'v1.feedback.feedback.setInstanceTimestampRest',
                                                                                'POST feedback/feedback/instance/question/response':
                                                                                  'v1.feedback.feedback.setQuestionResponseRest',
                                                                                'GET feedback/feedback/instance/responses/:id':
                                                                                  'v1.feedback.feedback.getUserAssignableResponsesRest',
                                                                                'GET feedback/feedback/results/:id': 'v1.feedback.feedback.getFeedbackResultsRest',
                                                                                'GET feedback/feedback/results/time/:id':
                                                                                  'v1.feedback.feedback.getFeedbackResultsWithTimeRest',

                                                                                // -- XApi (Finish) --
                                                                                'POST xapi/add/statement': 'v1.xapi.xapi.addStatementRest',

                                                                                // -- Tests (Finish) --
                                                                                'POST tests/tags/list': 'v1.tests.tags.listTagsRest',
                                                                                'POST tests/question-bank/list': 'v1.tests.questionsBanks.listQuestionBanksRest',
                                                                                'GET tests/question-bank/:id': 'v1.tests.questionsBanks.getQuestionBankDetailRest',
                                                                                'DELETE tests/question-bank/:id': 'v1.tests.questionsBanks.deleteQuestionBankRest',
                                                                                'POST tests/question-bank': 'v1.tests.questionsBanks.saveQuestionBanksRest',
                                                                                'GET tests/tests': 'v1.tests.tests.listTestsRest',
                                                                                'GET tests/tests/:id': 'v1.tests.tests.getTestRest',
                                                                                'DELETE tests/tests/:id': 'v1.tests.tests.deleteTestRest',
                                                                                'POST tests/tests': 'v1.tests.tests.saveTestRest',
                                                                                'GET tests/tests/assign/configs': 'v1.tests.tests.getAssignConfigsRest',
                                                                                'POST tests/tests/assign': 'v1.tests.tests.assignTestRest',
                                                                                'POST tests/tests/duplicate': 'v1.tests.tests.duplicateRest',
                                                                                'POST tests/questions/details': 'v1.tests.questions.getDetailsRest',
                                                                                'GET tests/tests/instance/:id/feedback/:user': 'v1.tests.tests.getInstanceFeedbackRest',
                                                                                'POST tests/tests/instance/feedback': 'v1.tests.tests.setInstanceFeedbackRest',
                                                                                'POST tests/tests/instance/timestamp': 'v1.tests.tests.setInstanceTimestampRest',
                                                                                'POST tests/tests/instance/question/response': 'v1.tests.tests.setQuestionResponseRest',
                                                                                'GET tests/tests/instance/:id/question/response':
                                                                                  'v1.tests.tests.getUserQuestionResponsesRest',

                                                                                // -- Board messages (Finish) --
                                                                                'POST board-messages/list': 'v1.board-messages.messages.listRest',
                                                                                'POST board-messages/save': 'v1.board-messages.messages.saveRest',
                                                                                'POST board-messages/overlaps': 'v1.board-messages.messages.getOverlapsRest',
                                                                                'POST board-messages/active': 'v1.board-messages.messages.getActiveRest',
                                                                                'POST board-messages/click': 'v1.board-messages.messages.addClickRest',
                                                                                'POST board-messages/view': 'v1.board-messages.messages.addViewRest',

                                                                                // -- Attendance control (Finish) --
                                                                                'POST attendance-control/assistance/roll-call':
                                                                                  'v1.attendance-control.assistance.rollCallRest',
                                                                                'GET attendance-control/session/temporal/:class':
                                                                                  'v1.attendance-control.session.rollCallRest',
                                                                                'POST attendance-control/class/sessions':
                                                                                  'v1.attendance-control.session.getClassSessionsRest',
                                                                                'GET attendance-control/session/detail/:id': 'v1.attendance-control.session.detailRest',
                                                                                'POST attendance-control/session/save': 'v1.attendance-control.session.saveRest',

                                                                                // -- Curriculum (Finish) --
                                                                                'POST curriculum/data-for-keys': 'v1.curriculum.curriculum.getDataForKeysRest',
                                                                                'POST curriculum/curriculum': 'v1.curriculum.curriculum.postCurriculumRest',
                                                                                'GET curriculum/curriculum': 'v1.curriculum.curriculum.listCurriculumRest',
                                                                                'POST curriculum/curriculum/:id/generate':
                                                                                  'v1.curriculum.curriculum.generateCurriculumRest',
                                                                                'POST curriculum/curriculum/:id/publish':
                                                                                  'v1.curriculum.curriculum.publishCurriculumRest',
                                                                                'DELETE curriculum/curriculum/:id': 'v1.curriculum.curriculum.deleteCurriculumRest',
                                                                                'POST curriculum/curriculum/:id': 'v1.curriculum.curriculum.getCurriculumRest',
                                                                                'POST curriculum/node-levels': 'v1.curriculum.nodeLevels.postNodeLevelsRest',
                                                                                'PUT curriculum/node-levels': 'v1.curriculum.nodeLevels.putNodeLevelRest',
                                                                                'POST curriculum/node': 'v1.curriculum.node.postNodeRest',
                                                                                'PUT curriculum/node': 'v1.curriculum.node.saveNodeRest',

                                                                                // -- MQTT AWS IOT (Finish) --
                                                                                'GET mqtt-aws-iot/credentials': 'v1.mqtt-aws-iot.socket.getCredentialsRest',
                                                                                'POST mqtt-aws-iot/config': 'v1.mqtt-aws-iot.socket.setConfigRest',
                                                                                'GET mqtt-aws-iot/config': 'v1.mqtt-aws-iot.socket.getConfigRest',

                                                                                // -- Dataset (Finish) --
                                                                                'POST dataset/get-schema': 'v1.dataset.dataset.getSchemaRest',
                                                                                'POST dataset/get-schema-locale': 'v1.dataset.dataset.getSchemaLocaleRest',
                                                                                'POST dataset/get-schema-field-locale': 'v1.dataset.dataset.getSchemaFieldLocaleRest',
                                                                                'POST dataset/save-field': 'v1.dataset.dataset.saveFieldRest',
                                                                                'POST dataset/save-multiple-fields': 'v1.dataset.dataset.saveMultipleFieldsRest',
                                                                                'POST dataset/remove-field': 'v1.dataset.dataset.removeFieldRest',

                                                                                // -- Academic calendar (Finish) --
                                                                                'GET academic-calendar/config/:programId': 'v1.academic-calendar.config.getRest',
                                                                                'POST academic-calendar/config': 'v1.academic-calendar.config.saveRest',
                                                                                'GET academic-calendar/regional-config/list/:center':
                                                                                  'v1.academic-calendar.regionalConfig.listRest',
                                                                                'POST academic-calendar/regional-config/save':
                                                                                  'v1.academic-calendar.regionalConfig.saveRest',

                                                                                // -- Comunica (Finish) --
                                                                                'POST calendar/calendar': 'v1.calendar.calendar.getCalendarRest',
                                                                                'POST calendar/schedule': 'v1.calendar.calendar.getScheduleRest',
                                                                                'GET calendar/event-types': 'v1.calendar.calendar.getEventTypesRest',
                                                                                'POST calendar/add/event': 'v1.calendar.calendar.addEventRest',
                                                                                'POST calendar/update/event': 'v1.calendar.calendar.updateEventRest',
                                                                                'POST calendar/update/event-subtask': 'v1.calendar.calendar.updateEventSubTasksRest',
                                                                                'POST calendar/remove/event': 'v1.calendar.calendar.removeEventRest',
                                                                                'GET calendar/kanban/list/columns': 'v1.calendar.calendar.listKanbanColumnsRest',
                                                                                'GET calendar/kanban/list/event/orders': 'v1.calendar.calendar.listKanbanEventOrdersRest',
                                                                                'POST calendar/kanban/save/event/orders':
                                                                                  'v1.calendar.calendar.saveKanbanEventOrdersRest',
                                                                                'POST calendar/configs/add': 'v1.calendar.calendar.addCalendarConfigRest',
                                                                                'POST calendar/configs/update/:id': 'v1.calendar.calendar.updateCalendarConfigRest',
                                                                                'GET calendar/configs/list': 'v1.calendar.calendar.listCalendarConfigRest',
                                                                                'GET calendar/configs/detail/:id': 'v1.calendar.calendar.detailCalendarConfigRest',
                                                                                'DELETE calendar/configs/remove/:id': 'v1.calendar.calendar.removeCalendarConfigRest',
                                                                                'GET calendar/configs/centers-with-out-assign':
                                                                                  'v1.calendar.calendar.getCentersWithOutAssignRest',
                                                                                'GET calendar/configs/calendars/:id':
                                                                                  'v1.calendar.calendar.getCalendarConfigCalendarsRest',
                                                                                'POST calendar/configs/event/add': 'v1.calendar.calendar.addConfigEventRest',
                                                                                'POST calendar/configs/event/update': 'v1.calendar.calendar.updateConfigEventRest',
                                                                                'POST calendar/configs/event/remove': 'v1.calendar.calendar.removeConfigEventRest',

                                                                                // -- Comunica (Finish) --
                                                                                'GET comunica/config/general': 'v1.comunica.config.getGeneralConfigRest',
                                                                                'GET comunica/config/center/:center': 'v1.comunica.config.getCenterConfigRest',
                                                                                'GET comunica/config/program/:program': 'v1.comunica.config.getProgramConfigRest',
                                                                                'GET comunica/config': 'v1.comunica.config.getRest',
                                                                                'POST comunica/config': 'v1.comunica.config.saveRest',
                                                                                'GET comunica/admin/config/:center': 'v1.comunica.config.getAdminConfigRest',
                                                                                'POST comunica/admin/config/:center': 'v1.comunica.config.saveAdminConfigRest',
                                                                                'GET comunica/room/list': 'v1.comunica.room.getRoomListRest',
                                                                                'GET comunica/room/:key/messages': 'v1.comunica.room.getMessagesRest',
                                                                                'POST comunica/room/:key/messages': 'v1.comunica.room.sendMessageRest',
                                                                                'POST comunica/room/:key/messages/read': 'v1.comunica.room.markMessagesAsReadRest',
                                                                                'GET comunica/room/:key': 'v1.comunica.room.getRoomRest',
                                                                                'POST comunica/room/:key/mute': 'v1.comunica.room.toggleMutedRoomRest',
                                                                                'POST comunica/room/:key/admin/mute': 'v1.comunica.room.toggleAdminMutedRoomRest',
                                                                                'POST comunica/room/:key/admin/disable': 'v1.comunica.room.toggleAdminDisableRoomRest',
                                                                                'POST comunica/room/:key/admin/remove/user-agent':
                                                                                  'v1.comunica.room.adminRemoveUserAgentRest',
                                                                                'POST comunica/room/:key/admin/remove': 'v1.comunica.room.adminRemoveRoomRest',
                                                                                'POST comunica/room/:key/admin/name': 'v1.comunica.room.adminUpdateRoomNameRest',
                                                                                'POST comunica/room/:key/admin/users': 'v1.comunica.room.adminAddUsersToRoomRest',
                                                                                'POST comunica/room/create': 'v1.comunica.room.createRoomRest',
                                                                                'POST comunica/room/:key/admin/image': 'v1.comunica.room.adminChangeRoomImageRest',
                                                                                'POST comunica/room/:key/attach': 'v1.comunica.room.toggleAttachedRoomRest',
                                                                                'POST comunica/room/messages/unread': 'v1.comunica.room.getUnreadMessagesRest',
                                                                                'POST comunica/room/messages/count': 'v1.comunica.room.getRoomsMessageCountRest',

                                                                                // -- Timetable (Finish) --
                                                                                'POST timetable/config': 'v1.timetable.config.createRest',
                                                                                'GET timetable/config': 'v1.timetable.config.getRest',
                                                                                'GET timetable/config/has': 'v1.timetable.config.hasRest',
                                                                                'PUT timetable/config': 'v1.timetable.config.updateRest',
                                                                                'DELETE timetable/config': 'v1.timetable.config.deleteRest',
                                                                                'POST timetable/timetable': 'v1.timetable.timetable.createRest',
                                                                                'GET timetable/timetable/:id': 'v1.timetable.timetable.getRest',
                                                                                'GET timetable/timetable/count/:id': 'v1.timetable.timetable.countRest',
                                                                                'PUT timetable/timetable/:id': 'v1.timetable.timetable.updateRest',
                                                                                'DELETE timetable/timetable/:id': 'v1.timetable.timetable.deleteRest',
                                                                                'GET timetable/settings': 'v1.timetable.settings.findOneRest',
                                                                                'POST timetable/settings': 'v1.timetable.settings.updateRest',
                                                                                'POST timetable/settings/enable-menu-item': 'v1.timetable.settings.enableMenuItemRest',

                                                                                // -- Multilanguage (Finish) --
                                                                                // 'POST multilanguage/common': 'v1.multilanguage.common.getRest',
                                                                                // 'POST multilanguage/common/logged': 'v1.multilanguage.common.getLoggedRest',
                                                                                // 'POST multilanguage/locale': 'v1.multilanguage.locales.addRest',
                                                                                // 'GET multilanguage/locales': 'v1.multilanguage.locales.getRest',

                                                                                // -- Users (Finish) --
                                                                                'POST users/tags/list': 'v1.users.tags.listTagsRest',
                                                                                'GET users/init/today-quote': 'v1.users.init.todayQuoteRest',
                                                                                'GET users/config/system-data-fields': 'v1.users.config.getSystemDataFieldsConfigRest',
                                                                                'POST users/config/system-data-fields': 'v1.users.config.saveSystemDataFieldsConfigRest',
                                                                                'POST users/user/session/config': 'v1.users.users.updateSessionConfigRest',
                                                                                // 'POST users/user/login': 'v1.users.users.loginRest',
                                                                                'POST users/user/recover': 'v1.users.users.recoverRest',
                                                                                'POST users/user/reset': 'v1.users.users.resetRest',
                                                                                'POST users/user/can/reset': 'v1.users.users.canResetRest',
                                                                                'POST users/user/can/register-password': 'v1.users.users.canRegisterPasswordRest',
                                                                                'POST users/user/register-password': 'v1.users.users.registerPasswordRest',
                                                                                'POST users/user/activate-user': 'v1.users.users.activateUserRest',
                                                                                'POST users/user/activation-mail': 'v1.users.users.sendWelcomeEmailToUserRest',
                                                                                'GET users/user': 'v1.users.users.detailRest',
                                                                                'GET users/user/profile': 'v1.users.users.profilesRest',
                                                                                'GET users/user/centers': 'v1.users.users.centersRest',
                                                                                'GET users/user/remember/login': 'v1.users.users.getRememberLoginRest',
                                                                                'GET users/get-data-for-user-agent-datasets':
                                                                                  'v1.users.users.getDataForUserAgentDatasetsRest',
                                                                                'POST users/save-data-for-user-agent-datasets':
                                                                                  'v1.users.users.saveDataForUserAgentDatasetsRest',
                                                                                'POST users/user/remember/login': 'v1.users.users.setRememberLoginRest',
                                                                                'DELETE users/user/remember/login': 'v1.users.users.removeRememberLoginRest',
                                                                                'GET users/user/profile/:id/token': 'v1.users.users.profileTokenRest',
                                                                                'GET users/user/center/:centerId/profile/:profileId/token':
                                                                                  'v1.users.users.centerProfileTokenRest',
                                                                                'POST users/user/list': 'v1.users.users.listRest',
                                                                                'POST users/user-agents/search': 'v1.users.users.searchUserAgentsRest',
                                                                                'POST users/user-agents/info': 'v1.users.users.getUserAgentsInfoRest',
                                                                                'POST users/user-agents/disable': 'v1.users.users.disableUserAgentRest',
                                                                                'POST users/user-agents/active': 'v1.users.users.activeUserAgentRest',
                                                                                'POST users/user/create/bulk': 'v1.users.users.createBulkRest',
                                                                                'GET users/user/:id/detail/page': 'v1.users.users.detailForPageRest',
                                                                                'POST users/user/:id/update': 'v1.users.users.updateUserRest',
                                                                                'POST users/user/:id/update-avatar': 'v1.users.users.updateUserAvatarRest',
                                                                                'POST users/user-agent/:id/update': 'v1.users.users.updateUserAgentRest',
                                                                                'DELETE users/user-agent/:id': 'v1.users.users.deleteUserAgentRest',
                                                                                'GET users/user-agent/:id/detail/page': 'v1.users.users.agentDetailForPageRest',
                                                                                'POST users/super-admin': 'v1.users.users.createSuperAdminRest',
                                                                                'POST users/user/contacts': 'v1.users.users.contactsRest',
                                                                                'POST users/add-all-permissions-to-all-profiles':
                                                                                  'v1.users.profiles.addAllPermissionsToAllProfilesRest',
                                                                                'POST users/profile/list': 'v1.users.profiles.listRest',
                                                                                'POST users/profile/add': 'v1.users.profiles.addRest',
                                                                                'GET users/profile/sysName': 'v1.users.profiles.getProfileSysNameRest',
                                                                                'GET users/profile/detail/:uri': 'v1.users.profiles.detailRest',
                                                                                'POST users/profile/update': 'v1.users.profiles.updateRest',
                                                                                'GET users/permission/list': 'v1.users.permissions.listRest',
                                                                                'POST users/permission/get-if-have':
                                                                                  'v1.users.permissions.getPermissionsWithActionsIfIHaveRest',
                                                                                'GET users/action/list': 'v1.users.actions.listRest',
                                                                                'POST users/roles/list': 'v1.users.roles.listRest',
                                                                                'GET users/roles/detail/:uri': 'v1.users.roles.detailRest',
                                                                                'POST users/roles/add': 'v1.users.roles.addRest',
                                                                                'POST users/roles/update': 'v1.users.roles.updateRest',
                                                                                'POST users/centers': 'v1.users.centers.listRest',
                                                                                'POST users/centers/add': 'v1.users.centers.addRest',
                                                                                'POST users/centers/remove': 'v1.users.centers.removeRest',
                                                                                'GET users/platform/default-locale': 'v1.users.platform.getDefaultLocaleRest',
                                                                                'GET users/platform/locales': 'v1.users.platform.getLocalesRest',
                                                                                'GET users/platform/theme': 'v1.users.platform.getThemeRest',

                                                                                // -- Admin (Finish) --
                                                                                'GET admin/i18n/:page/:lang': 'v1.admin.i18n.getLangRest',
                                                                                'GET admin/settings': 'v1.admin.settings.findOneRest',
                                                                                'POST admin/settings/languages': 'v1.admin.settings.setLanguagesRest',
                                                                                'GET admin/settings/languages': 'v1.admin.settings.getLanguagesRest',
                                                                                'POST admin/settings/signup': 'v1.admin.settings.signupRest',
                                                                                'POST admin/settings': 'v1.admin.settings.updateRest',
                                                                                'GET admin/mail/providers': 'v1.admin.mail.getProvidersRest',
                                                                                'GET admin/mail/platform': 'v1.admin.mail.getPlatformEmailRest',
                                                                                'POST admin/mail/platform': 'v1.admin.mail.savePlatformEmailRest',
                                                                                'GET admin/organization': 'v1.admin.organization.getRest',
                                                                                'POST admin/organization': 'v1.admin.organization.postRest',
                                                                                'GET admin/organization/jsonTheme': 'v1.admin.organization.getJsonThemeRest',

                                                                                // -- Emails (Finish) --
                                                                                'GET emails/providers': 'v1.emails.email.providersRest',
                                                                                'POST emails/send-test': 'v1.emails.email.sendTestRest',
                                                                                'POST emails/send-custom-test': 'v1.emails.email.sendCustomTestRest',
                                                                                'POST emails/save-provider': 'v1.emails.email.saveProviderRest',
                                                                                'POST emails/remove-provider': 'v1.emails.email.removeProviderRest',
                                                                                'GET emails/config': 'v1.emails.config.getConfigRest',
                                                                                'POST emails/config': 'v1.emails.config.saveConfigRest',

                                                                                // -- Menu builder (Finish) --
                                                                                'GET menu-builder/know-how-to-use': 'v1.menu-builder.menu.getIfKnowHowToUseRest',
                                                                                'POST menu-builder/know-how-to-use': 'v1.menu-builder.menu.setKnowHowToUseRest',
                                                                                'GET menu-builder/menu/:menuKey': 'v1.menu-builder.menu.getIfHasPermissionRest',
                                                                                'POST menu-builder/menu/:menuKey/add-item': 'v1.menu-builder.menu.addCustomForUserRest',
                                                                                'POST menu-builder/menu/:menuKey/re-order':
                                                                                  'v1.menu-builder.menu.reOrderCustomUserItemsRest',
                                                                                'DELETE menu-builder/menu/:menuKey/:key': 'v1.menu-builder.menu.removeCustomForUserRest',
                                                                                'POST menu-builder/menu/:menuKey/:key': 'v1.menu-builder.menu.updateCustomForUserRest',

                                                                                // -- Widgets (Finish) --
                                                                                'GET widgets/zone/:key': 'v1.widgets.widgets.getZoneRest',

                                                                                // -- Dashboard (Finish) --
                                                                                'GET dashboard/admin/realtime': 'v1.dashboard.admin.adminRealtimeRest',
                                                                                'GET dashboard/admin': 'v1.dashboard.admin.adminRest',

                                                                                // -- Academic portfolio (Finish) --
                                                                                'GET academic-portfolio/user/programs':
                                                                                  'v1.academic-portfolio.programs.getUserProgramsRest',
                                                                                'PUT academic-portfolio/program': 'v1.academic-portfolio.programs.putProgramRest',
                                                                                'POST academic-portfolio/program': 'v1.academic-portfolio.programs.postProgramRest',
                                                                                'GET academic-portfolio/program': 'v1.academic-portfolio.programs.listProgramRest',
                                                                                'GET academic-portfolio/program/:id/tree':
                                                                                  'v1.academic-portfolio.programs.getProgramTreeRest',
                                                                                'GET academic-portfolio/program/have': 'v1.academic-portfolio.programs.haveProgramsRest',
                                                                                'POST academic-portfolio/program/:id/duplicate':
                                                                                  'v1.academic-portfolio.programs.duplicateProgramRest',
                                                                                'GET academic-portfolio/program/:id': 'v1.academic-portfolio.programs.detailProgramRest',
                                                                                'GET academic-portfolio/program/:id/evaluation-system':
                                                                                  'v1.academic-portfolio.programs.getProgramEvaluationSystemRest',
                                                                                'GET academic-portfolio/program/:id/has/courses':
                                                                                  'v1.academic-portfolio.programs.programHasCoursesRest',
                                                                                'GET academic-portfolio/program/:id/has/groups':
                                                                                  'v1.academic-portfolio.programs.programHasGroupsRest',
                                                                                'GET academic-portfolio/program/:id/has/substages':
                                                                                  'v1.academic-portfolio.programs.programHasSubstagesRest',
                                                                                'GET academic-portfolio/program/:id/courses':
                                                                                  'v1.academic-portfolio.programs.programCoursesRest',
                                                                                'GET academic-portfolio/program/:id/groups':
                                                                                  'v1.academic-portfolio.programs.programGroupsRest',
                                                                                'GET academic-portfolio/program/:id/substages':
                                                                                  'v1.academic-portfolio.programs.programSubstagesRest',
                                                                                'DELETE academic-portfolio/program/:id':
                                                                                  'v1.academic-portfolio.programs.deleteProgramRest',
                                                                                'POST academic-portfolio/program/add-students-to-classes-under-node-tree':
                                                                                  'v1.academic-portfolio.programs.addStudentsToClassesUnderNodeTreeRest',
                                                                                'PUT academic-portfolio/cycle': 'v1.academic-portfolio.cycle.putCycleRest',
                                                                                'POST academic-portfolio/knowledge': 'v1.academic-portfolio.knowledges.postKnowledgeRest',
                                                                                'PUT academic-portfolio/knowledge': 'v1.academic-portfolio.knowledges.putKnowledgeRest',
                                                                                'GET academic-portfolio/knowledge': 'v1.academic-portfolio.knowledges.listKnowledgeRest',
                                                                                'POST academic-portfolio/subject-type':
                                                                                  'v1.academic-portfolio.subjectType.postSubjectTypeRest',
                                                                                'PUT academic-portfolio/subject-type':
                                                                                  'v1.academic-portfolio.subjectType.putSubjectTypeRest',
                                                                                'GET academic-portfolio/subject-type':
                                                                                  'v1.academic-portfolio.subjectType.listSubjectTypeRest',
                                                                                'POST academic-portfolio/course': 'v1.academic-portfolio.courses.postCourseRest',
                                                                                'PUT academic-portfolio/course': 'v1.academic-portfolio.courses.putCourseRest',
                                                                                'GET academic-portfolio/course': 'v1.academic-portfolio.courses.listCourseRest',
                                                                                'POST academic-portfolio/group': 'v1.academic-portfolio.groups.postGroupRest',
                                                                                'PUT academic-portfolio/group': 'v1.academic-portfolio.groups.putGroupRest',
                                                                                'GET academic-portfolio/group': 'v1.academic-portfolio.groups.listGroup',
                                                                                'DELETE academic-portfolio/group-from-classes-under-node-tree':
                                                                                  'v1.academic-portfolio.groups.deleteGroupFromClassesUnderNodeTreeRest',
                                                                                'POST academic-portfolio/group/:id/duplicate-with-classes-under-node-tree':
                                                                                  'v1.academic-portfolio.groups.duplicateGroupWithClassesUnderNodeTreeRest',
                                                                                'POST academic-portfolio/group/duplicate':
                                                                                  'v1.academic-portfolio.groups.duplicateGroupRest',
                                                                                'POST academic-portfolio/subject': 'v1.academic-portfolio.subjects.postSubjectRest',
                                                                                'PUT academic-portfolio/subject': 'v1.academic-portfolio.subjects.putSubjectRest',
                                                                                'DELETE academic-portfolio/subject/:id':
                                                                                  'v1.academic-portfolio.subjects.deleteSubjectRest',
                                                                                'PUT academic-portfolio/subject/credits':
                                                                                  'v1.academic-portfolio.subjects.putSubjectCreditsRest',
                                                                                'GET academic-portfolio/subject/credits':
                                                                                  'v1.academic-portfolio.subjects.getSubjectCreditsRest',
                                                                                'GET academic-portfolio/subject/credits/list':
                                                                                  'v1.academic-portfolio.subjects.listSubjectCreditsForProgramRest',
                                                                                'GET academic-portfolio/subject': 'v1.academic-portfolio.subjects.listSubjectRest',
                                                                                'GET academic-portfolio/subject/:id': 'v1.academic-portfolio.subjects.subjectByIdsRest',
                                                                                'GET academic-portfolio/subjects': 'v1.academic-portfolio.subjects.subjectByIdsRest',
                                                                                'GET academic-portfolio/class': 'v1.academic-portfolio.classes.listClassRest',
                                                                                'GET academic-portfolio/subjects/class':
                                                                                  'v1.academic-portfolio.classes.listSubjectClassesRest',
                                                                                'GET academic-portfolio/classes/have': 'v1.academic-portfolio.classes.haveClassesRest',
                                                                                'POST academic-portfolio/class': 'v1.academic-portfolio.classes.postClassRest',
                                                                                'DELETE academic-portfolio/class/:id': 'v1.academic-portfolio.classes.removeClassRest',
                                                                                'GET academic-portfolio/class/dashboard/:id':
                                                                                  'v1.academic-portfolio.classes.classDetailForDashboardRest',
                                                                                'PUT academic-portfolio/class': 'v1.academic-portfolio.classes.putClassRest',
                                                                                'PUT academic-portfolio/class/many': 'v1.academic-portfolio.classes.putClassManyRest',
                                                                                'POST academic-portfolio/class/students':
                                                                                  'v1.academic-portfolio.classes.postClassStudentsRest',
                                                                                'POST academic-portfolio/class/teachers':
                                                                                  'v1.academic-portfolio.classes.postClassTeachersRest',
                                                                                'POST academic-portfolio/class/remove/students':
                                                                                  'v1.academic-portfolio.classes.removeStudentRest',
                                                                                'GET academic-portfolio/classes': 'v1.academic-portfolio.classes.classByIdsRest',
                                                                                'GET academic-portfolio/student/:id/classes':
                                                                                  'v1.academic-portfolio.classes.listStudentClassesRest',
                                                                                'POST academic-portfolio/session/classes':
                                                                                  'v1.academic-portfolio.classes.listSessionClassesRest',
                                                                                'GET academic-portfolio/teacher/:id/classes':
                                                                                  'v1.academic-portfolio.classes.listTeacherClassesRest',
                                                                                'POST academic-portfolio/class/instance':
                                                                                  'v1.academic-portfolio.classes.postClassInstanceRest',
                                                                                'GET academic-portfolio/class-subjects':
                                                                                  'v1.academic-portfolio.common.listClassSubjectsRest',
                                                                                'GET academic-portfolio/tree': 'v1.academic-portfolio.common.getTreeRest',
                                                                                'GET academic-portfolio/classes-under-node-tree':
                                                                                  'v1.academic-portfolio.common.getClassesUnderNodeTreeRest',
                                                                                'POST academic-portfolio/add-students-to-classes-under-node-tree':
                                                                                  'v1.academic-portfolio.common.addStudentsToClassesUnderNodeTreeRest',
                                                                                'POST academic-portfolio/add-teachers-to-classes-under-node-tree':
                                                                                  'v1.academic-portfolio.common.addTeachersToClassesUnderNodeTreeRest',
                                                                                'POST academic-portfolio/students/by/tags':
                                                                                  'v1.academic-portfolio.common.getStudentsByTagsRest',
                                                                                'GET academic-portfolio/settings': 'v1.academic-portfolio.settings.findOneRest',
                                                                                'POST academic-portfolio/settings': 'v1.academic-portfolio.settings.updateRest',
                                                                                'POST academic-portfolio/settings/enable-menu-item':
                                                                                  'v1.academic-portfolio.settings.enableMenuItemRest',
                                                                                'GET academic-portfolio/settings/profiles/is-config':
                                                                                  'v1.academic-portfolio.settings.isProfilesConfigRest',
                                                                                'GET academic-portfolio/settings/profiles':
                                                                                  'v1.academic-portfolio.settings.getProfilesRest',
                                                                                'PUT academic-portfolio/settings/profiles':
                                                                                  'v1.academic-portfolio.settings.setProfilesRest',

                                                                                // -- Grades (Finish) --
                                                                                'GET grades/grades': 'v1.grades.grades.listGradesRest',
                                                                                'POST grades/grades': 'v1.grades.grades.postGradeRest',
                                                                                'PUT grades/grades': 'v1.grades.grades.putGradeRest',
                                                                                'GET grades/grades/have': 'v1.grades.grades.haveGradesRest',
                                                                                'GET grades/grades/:id': 'v1.grades.grades.getGradeRest',
                                                                                'DELETE grades/grades/:id': 'v1.grades.grades.removeGradeRest',
                                                                                'POST grades/grade-scales': 'v1.grades.gradeScales.postGradeScaleRest',
                                                                                'PUT grades/grade-scales': 'v1.grades.gradeScales.putGradeScaleRest',
                                                                                'DELETE grades/grade-scales/:id': 'v1.grades.gradeScales.removeGradeScaleRest',
                                                                                'DELETE grades/grade-scales/can/:id': 'v1.grades.gradeScales.canRemoveGradeScaleRest',
                                                                                'POST grades/grade-tags': 'v1.grades.gradeTags.postGradeTagRest',
                                                                                'PUT grades/grade-tags': 'v1.grades.gradeTags.putGradeTagRest',
                                                                                'DELETE grades/grade-tags/:id': 'v1.grades.gradeTags.removeGradeTagRest',
                                                                                'GET grades/rules': 'v1.grades.rules.listRulesRest',
                                                                                'GET grades/rules/have': 'v1.grades.rules.haveRulesRest',
                                                                                'POST grades/rules': 'v1.grades.rules.postRuleRest',
                                                                                'PUT grades/rules': 'v1.grades.rules.putRuleRest',
                                                                                'DELETE grades/rules/:id': 'v1.grades.rules.deleteRuleRest',
                                                                                'POST grades/rules/process': 'v1.grades.rules.postRuleProcessRest',
                                                                                'GET grades/dependencies': 'v1.grades.dependency.listDependenciesRest',
                                                                                'POST grades/dependencies': 'v1.grades.dependency.postDependencyRest',
                                                                                'PUT grades/dependencies': 'v1.grades.dependency.putDependencyRest',
                                                                                'DELETE grades/dependencies/:id': 'v1.grades.dependency.deleteDependencyRest',
                                                                                'GET grades/settings': 'v1.grades.settings.findOneRest',
                                                                                'POST grades/settings': 'v1.grades.settings.updateRest',
                                                                                'POST grades/settings/enable-menu-item': 'v1.grades.settings.enableMenuItemRest',

                                                                                // -- Leebrary (NOT FINISHED) --
                                                                                'GET leebrary/providers': 'v1.leebrary.providers.listRest',
                                                                                'POST leebrary/providers/config': 'v1.leebrary.providers.setConfigRest',
                                                                                'POST leebrary/providers/config/delete': 'v1.leebrary.providers.deleteConfigRest',
                                                                                'GET leebrary/assets/:id': 'v1.leebrary.assets.getRest',
                                                                                'GET leebrary/assets/my': 'v1.leebrary.assets.myRest',
                                                                                'GET leebrary/assets/url-metadata': 'v1.leebrary.assets.urlMetadataRest',
                                                                                'GET leebrary/assets/list': 'v1.leebrary.assets.listRest',
                                                                                'GET leebrary/assets/pins': 'v1.leebrary.assets.pinsRest',
                                                                                'GET leebrary/assets/has-pins': 'v1.leebrary.assets.hasPinsRest',
                                                                                'POST leebrary/assets': 'v1.leebrary.assets.addRest',
                                                                                'POST leebrary/assets/:id': 'v1.leebrary.assets.duplicateRest',
                                                                                'POST leebrary/assets/list': 'v1.leebrary.assets.listByIdsRest',
                                                                                'POST leebrary/asset/:asset/permissions': 'v1.leebrary.permissions.setRest',
                                                                                'POST leebrary/assets/pins': 'v1.leebrary.assets.addPinRest',
                                                                                'PUT leebrary/assets/:id': 'v1.leebrary.assets.updateRest',
                                                                                'DELETE leebrary/assets/:id': 'v1.leebrary.assets.removeRest',
                                                                                'DELETE leebrary/assets/pins/:id': 'v1.leebrary.assets.removePinRest',
                                                                                'GET leebrary/categories/menu-list': 'v1.leebrary.categories.listWithMenuItemRest',
                                                                                'GET leebrary/categories/:id/types': 'v1.leebrary.categories.assetTypesRest',
                                                                                'GET leebrary/search/search': 'v1.leebrary.search.searchRest',
                                                                                'POST leebrary/tags/list': 'v1.leebrary.tags.listTagsRest',
                                                                                'POST leebrary/file/multipart/new': 'v1.leebrary.file.newMultipartRest',
                                                                                'POST leebrary/file/multipart/abort': 'v1.leebrary.file.abortMultipartRest',
                                                                                'POST leebrary/file/multipart/finish': 'v1.leebrary.file.finishMultipartRest',
                                                                                'POST leebrary/file/multipart/chunk':
                                                                                  'multipart:v1.leebrary.file.uploadMultipartChunkRest',
                                                                                'GET leebrary/img/:assetId': 'v1.leebrary.file.coverRest',
                                                                                'GET leebrary/file/:id': 'v1.leebrary.file.fileRest',
                                                                                'GET leebrary/file/:id/(.*)': 'v1.leebrary.file.folderRest',
                                                                                'GET leebrary/file/public/:id': 'v1.leebrary.file.publicFileRest',
                                                                                'GET leebrary/file/public/:id/(.*)': 'v1.leebrary.file.publicFolderRest',

                                                                                // -- Leebrary AWS S3 (NOT FINISHED) --
                                                                                'GET leebrary-aws-s3/config': 'v1.leebrary-aws-s3.config.getConfigRest',

                                                                                // -- Assignables(FINISHED) --
                                                                                'GET assignables/assignables/find': 'v1.assignables.assignables.getRest',
                                                                                'GET assignables/activities/search/ongoing':
                                                                                  'v1.assignables.activities.searchOngoingRest',
                                                                                'GET assignables/activities/search/nya':
                                                                                  'v1.assignables.activities.searchNyaActivitiesRest',
                                                                                'GET assignables/assignations/find': 'v1.assignables.assignations.getManyRest',
                                                                                'GET assignables/assignableInstances/:instance/assignations/:user':
                                                                                  'v1.assignables.assignations.getRest',
                                                                                'GET assignables/assignableInstances/search':
                                                                                  'v1.assignables.assignableInstances.searchRest',
                                                                                'GET assignables/assignableInstances/find': 'v1.assignables.assignableInstances.getRest',
                                                                                'GET assignables/assignableInstances/:id': 'v1.assignables.assignableInstances.getRest',
                                                                                'PUT assignables/assignableInstances/:id':
                                                                                  'v1.assignables.assignableInstances.updateRest',
                                                                                'POST assignables/assignableInstances/reminder':
                                                                                  'v1.assignables.assignableInstance.sendReminderRest',

                                                                                // -- Tasks (FINISHED) --
                                                                                'GET tasks/settings': 'v1.tasks.settings.findOneRest',
                                                                                'POST tasks/settings': 'v1.tasks.settings.updateRest',
                                                                                'POST tasks/settings/enable-menu-item': 'v1.tasks.settings.enableMenuItemRest',
                                                                                'GET tasks/profiles/:key': 'v1.tasks.profiles.getRest',
                                                                                'POST tasks/profiles/:key': 'v1.tasks.profiles.setRest',
                                                                                'POST tasks/profiles': 'v1.tasks.profiles.setManyRest',
                                                                                'POST tasks/tasks': 'v1.tasks.tasks.createRest',
                                                                                'PUT tasks/tasks/:id': 'v1.tasks.tasks.updateRest',
                                                                                'GET tasks/tasks/:id': 'v1.tasks.tasks.getRest',
                                                                                'POST tasks/tasks/:id/duplicate': 'v1.tasks.tasks.duplicateRest',
                                                                                'DELETE tasks/tasks/:id': 'v1.tasks.tasks.removeRest',
                                                                                'POST tasks/tasks/:id/publish': 'v1.tasks.tasks.publishRest',
                                                                                'GET tasks/tasks/search': 'v1.tasks.tasks.searchRest',
                                                                                'POST tasks/tasks/:task/assignments/instance': 'v1.tasks.assignments.instanceCreateRest',
                                                                                'PUT tasks/tasks/assignments/instance/:instance': 'v1.tasks.assignments.instanceGetRest',
                                                                                'PUT tasks/tasks/instances/:instance/students/:student':
                                                                                  'v1.tasks.assignments.studentUpdateRest',

                                                                                // -- Bulk Template (Not Finished) --
                                                                                'POST bulk-data/load-from-file': 'multipart:v1.bulk-data.bulk.loadRest',
                                                                                'GET bulk-data/load-from-file': 'v1.bulk-data.bulk.statusRest',
                                                                                'POST bulk-data/init-super': 'v1.bulk-data.users.initSuperRest',

                                                                                 */
        },

        /**
                 * Before call hook. You can check the request.
                 * @param {Context} ctx
                 * @param {Object} route
                 * @param {IncomingRequest} req
                 * @param {ServerResponse} res
                 * @param {Object} data
                 *
                 onBeforeCall(ctx, route, req, res) {
                 // Set request headers to context meta
                 ctx.meta.userAgent = req.headers["user-agent"];
                 }, */

        /**
                 * After call hook. You can modify the data.
                 * @param {Context} ctx
                 * @param {Object} route
                 * @param {IncomingRequest} req
                 * @param {ServerResponse} res
                 * @param {Object} data
                 onAfterCall(ctx, route, req, res, data) {
                 // Async function which return with Promise
                 return doSomething(ctx, res, data);
                 }, */

        onBeforeCall(ctx, route, req) {
          ctx.meta.clientIP =
            req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
          const url = req.headers.referer || req.headers.referrer || req.headers.host;
          if (url.startsWith('localhost')) {
            ctx.meta.hostname = 'localhost';
          } else {
            const parseResult = parse(url);
            if (ctx.meta) {
              if (
                process.env.MANUAL_PASSWORD &&
                req.headers.apiKey === process.env.MANUAL_PASSWORD &&
                req.headers.customDomain
              ) {
                ctx.meta.hostname = req.headers.customDomain;
              }
              ctx.meta.hostname =
                parseResult?.hostname ||
                parseResult?.host ||
                parseResult?.pathname ||
                parseResult?.path;
            }
          }
        },

        onError(req, res, err) {
          const response = { ...err, message: err.message };
          res.setHeader('Content-Type', 'application/json');
          res.writeHead(err.httpStatusCode || err.code || 500);
          res.end(JSON.stringify(response));
        },

        // Calling options. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Calling-options
        callingOptions: {},

        bodyParsers: {
          json: {
            strict: false,
            limit: '1MB',
          },
          urlencoded: {
            extended: true,
            limit: '1MB',
          },
        },

        // Mapping policy setting. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
        mappingPolicy: 'all', // Available values: "all", "restrict"

        // Enable/disable logging
        logging: true,
      },
    ],

    // Do not log client side errors (does not log an error response when the error.code is 400<=X<500)
    log4XXResponses: true,
    // Logging the request parameters. Set to any log level to enable it. E.g. "info"
    logRequestParams: null,
    // Logging the response data. Set to any log level to enable it. E.g. "info"
    logResponseData: null,

    // Serve assets from "public" folder. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Serve-static-files
    assets: {
      folder: 'public',

      // Options to `server-static` module
      options: {},
    },
  },

  methods: {
    /**
     * Authenticate the request. It check the `Authorization` token value in the request header.
     * Check the token value & resolve the user by the token.
     * The resolved user will be available in `ctx.meta.user`
     *
     * PLEASE NOTE, IT'S JUST AN EXAMPLE IMPLEMENTATION. DO NOT USE IN PRODUCTION!
     *
     * @param {Context} ctx
     * @param {Object} route
     * @param {IncomingRequest} req
     * @returns {Promise}
     */
    async authenticate(ctx, route, req) {
      let { authorization } = req.headers;
      if (!authorization) authorization = req.query.authorization;
      try {
        authorization = JSON.parse(authorization);
      } catch (e) {
        // Nothing
      }
      ctx.meta.authorization = authorization;
    },

    /**
     * Authorize the request. Check that the authenticated user has right to access the resource.
     *
     * PLEASE NOTE, IT'S JUST AN EXAMPLE IMPLEMENTATION. DO NOT USE IN PRODUCTION!
     *
     * @param {Context} ctx
     * @param {Object} route
     * @param {IncomingRequest} req
     * @returns {Promise}
     */
    async authorize(ctx, route, req) {
      // Get the authenticated user.
      const { user } = ctx.meta;

      // It check the `auth` property in action schema.
      if (req.$action.auth == 'required' && !user) {
        throw new ApiGateway.Errors.UnAuthorizedError('NO_RIGHTS');
      }
    },
  },
};
