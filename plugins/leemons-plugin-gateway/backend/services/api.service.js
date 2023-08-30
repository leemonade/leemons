const ApiGateway = require('moleculer-web');
const { LeemonsDeploymentManagerMixin } = require('leemons-deployment-manager');

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
  mixins: [ApiGateway, LeemonsDeploymentManagerMixin({ checkIfCanCallMe: false })],

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
          // -- Multilanguage (Finish) --
          'POST multilanguage/common': 'v1.multilanguage.common.getRest',
          'POST multilanguage/common/logged': 'v1.multilanguage.common.getLoggedRest',
          'POST multilanguage/locale': 'v1.multilanguage.locales.addRest',
          'GET multilanguage/locales': 'v1.multilanguage.locales.getRest',

          // -- Users (Finish) --
          'POST users/tags/list': 'v1.users.tags.listTagsRest',
          'GET users/init/today-quote': 'v1.users.init.todayQuoteRest',
          'GET users/config/system-data-fields': 'v1.users.config.getSystemDataFieldsConfigRest',
          'POST users/config/system-data-fields': 'v1.users.config.saveSystemDataFieldsConfigRest',
          'GET users/user/session/config': 'v1.users.users.updateSessionConfigRest',
          'POST users/user/login': 'v1.users.users.loginRest',
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

        onError(req, res, err) {
          const response = { ...err, message: err.message };
          res.setHeader('Content-Type', 'application/json');
          res.writeHead(err.httpStatusCode || 500);
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
