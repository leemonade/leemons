import * as _ from 'lodash';
import { RRule } from 'rrule';

export default function transformCalendarConfigToEvents(config) {
  if (config && _.isArray(config.notSchoolDays)) {
    const start = new Date();
    start.setHours(0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59);
    return [
      {
        title: '',
        display: 'background',
        backgroundColor: 'rgba(69,69,69,0.3)',
        start,
        end,
        rrule: {
          freq: RRule.WEEKLY,
          byweekday: config.notSchoolDays,
        },
      },
    ];
  }

  return [];
}
