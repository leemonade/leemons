module.exports = {
  PLATFORM_NAME: 'singlePlatform',
  ADMIN_BULK_ID: 'admin',
  SUPER_ADMIN_BULK_ID: 'super',
  ADMIN_EMAIL: 'admin@leemons.io',
  SUPER_ADMIN_EMAIL: 'super@leemons.io',
  AUTO_PASSWORD: 'auto-pass',
  ASSET_CATEGORIES: {
    LIBRARY_CATEGORIES: { MEDIA_FILES: 'media-files', BOOKMARKS: 'bookmarks' },
    TASKS: 'assignables.task',
    CONTENT_CREATOR: 'assignables.content-creator',
    FEEDBACK: 'assignables.feedback',
    LEARNING_PATHS_MODULE: 'assignables.learningpaths.module',
    SCORM: 'assignables.scorm',
    TESTS: 'assignables.tests',
    TEST_QUESTION_BANKS: 'tests-questions-banks',
    LIBRARY_ASSETS: 'assignables.library.asset',
  },
  KANBAN_COLUMN_NAMES: ['', 'backlog', 'todo', 'inprogress', 'underreview', 'done'],
  REGIONAL_CALENDAR_EVENT_TYPE: {
    REGIONAL: 'regional',
    LOCAL: 'local',
    DAY_OFF: 'day-off',
  },
  PROGRAM_CALENDAR_EVENT_TYPES: {
    COURSE: { type: 'course', calendarField: 'courseDates' },
    COURSE_EVENTS: { type: 'course-events', calendarField: 'courseEvents' },
    BREAKS: { type: 'breaks', calendarField: 'breaks' },
    SUBSTAGES: { type: 'substages', calendarField: 'substagesDates' },
  },
};
