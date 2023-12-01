// automatic hash: 8a7713b23e1e95c0dc58f93e9a4dcd11949ad961e3bb99d7c4b978e0efd6ad68
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    items: {
      type: 'object',
      properties: {
        'calendar.event_modal.name': {
          type: 'string',
          minLength: 1,
        },
        'calendar.event_modal.subtasks': {
          type: 'string',
          minLength: 1,
        },
        'calendar.event_modal.title': {
          type: 'string',
          minLength: 1,
        },
        'calendar.event_modal.save': {
          type: 'string',
          minLength: 1,
        },
        'calendar.event_modal.update': {
          type: 'string',
          minLength: 1,
        },
        'calendar.event_modal.all_day': {
          type: 'string',
          minLength: 1,
        },
        'calendar.event_modal.add_done': {
          type: 'string',
          minLength: 1,
        },
        'calendar.event_modal.updated_done': {
          type: 'string',
          minLength: 1,
        },
        'calendar.event_modal.from': {
          type: 'string',
          minLength: 1,
        },
        'calendar.event_modal.to': {
          type: 'string',
          minLength: 1,
        },
        'calendar.event_modal.repeatLabel': {
          type: 'string',
          minLength: 1,
        },
        'calendar.event_modal.cancel': {
          type: 'string',
          minLength: 1,
        },
        'calendar.event_modal.selectCalendar': {
          type: 'string',
          minLength: 1,
        },
        'calendar.event_modal.showInCalendar': {
          type: 'string',
          minLength: 1,
        },
        'calendar.event_modal.calendarLabel': {
          type: 'string',
          minLength: 1,
        },
        'calendar.event_modal.calendarLabelDisabled': {
          type: 'string',
          minLength: 1,
        },
        'calendar.event_modal.users': {
          type: 'string',
          minLength: 1,
        },
        'calendar.event_modal.usersDisabled': {
          type: 'string',
          minLength: 1,
        },
        'calendar.event_modal.showMore': {
          type: 'string',
          minLength: 1,
        },
        'calendar.event_modal.showLess': {
          type: 'string',
          minLength: 1,
        },
        'calendar.event_modal.repeat.dont_repeat': {
          type: 'string',
          minLength: 1,
        },
        'calendar.event_modal.repeat.every_day': {
          type: 'string',
          minLength: 1,
        },
        'calendar.event_modal.repeat.every_week': {
          type: 'string',
          minLength: 1,
        },
        'calendar.event_modal.repeat.every_month': {
          type: 'string',
          minLength: 1,
        },
        'calendar.event_modal.repeat.every_year': {
          type: 'string',
          minLength: 1,
        },
      },
      required: [
        'calendar.event_modal.name',
        'calendar.event_modal.subtasks',
        'calendar.event_modal.title',
        'calendar.event_modal.save',
        'calendar.event_modal.update',
        'calendar.event_modal.all_day',
        'calendar.event_modal.add_done',
        'calendar.event_modal.updated_done',
        'calendar.event_modal.from',
        'calendar.event_modal.to',
        'calendar.event_modal.repeatLabel',
        'calendar.event_modal.cancel',
        'calendar.event_modal.selectCalendar',
        'calendar.event_modal.showInCalendar',
        'calendar.event_modal.calendarLabel',
        'calendar.event_modal.calendarLabelDisabled',
        'calendar.event_modal.users',
        'calendar.event_modal.usersDisabled',
        'calendar.event_modal.showMore',
        'calendar.event_modal.showLess',
        'calendar.event_modal.repeat.dont_repeat',
        'calendar.event_modal.repeat.every_day',
        'calendar.event_modal.repeat.every_week',
        'calendar.event_modal.repeat.every_month',
        'calendar.event_modal.repeat.every_year',
      ],
    },
  },
  required: ['items'],
};

module.exports = { schema };
