import React from 'react';
import _ from 'lodash';
import { getAssetUrl } from '@leebrary/helpers/prepareAsset';
import { Box, Text } from '@bubbles-ui/components';

export default function getClassScheduleAsEvents(_classe, breaks, { firstDayOfWeek = 1 } = {}) {
  const classes = _.isArray(_classe) ? _classe : [_classe];
  const events = [];
  let curr = new Date(); // get current date

  const day = curr.getDay();
  const first = curr.getDate() - day;

  let crossDayEvents = false;

  _.forEach(classes, (classe) => {
    if (classe.showEvents) {
      const title = `${classe.subject.name} (${classe.groups.abbreviation})`.replace(
        '(-auto-)',
        ''
      );
      const icon = classe.subject.icon ? getAssetUrl(classe.subject.icon.id) : null;
      _.forEach(classe.schedule, (schedule, i) => {
        function getDates(dayWeek) {
          curr = new Date();
          const diffHours = schedule.end.split(':')[0] - schedule.start.split(':')[0];
          curr.setDate(first + dayWeek);
          const start = new Date(curr);
          const end = diffHours >= 0 ? new Date(curr) : new Date(curr.setDate(curr.getDate() + 1));
          const startSplit = schedule.start.split(':');
          const endSplit = schedule.end.split(':');
          start.setHours(parseInt(startSplit[0], 10), parseInt(startSplit[1], 10), 0, 0);
          end.setHours(parseInt(endSplit[0], 10), parseInt(endSplit[1], 10), 0, 0);

          return {
            start,
            end,
          };
        }

        const { dayWeek } = schedule;

        const { start, end } = getDates(dayWeek);
        const newEvent = {
          id: `${classe.id}-${i}`,
          title,
          allDay: false,
          start,
          end,
          originalEvent: {
            start: start,
            end: end,
            title,
            bgColor: classe.color,
            borderColor: classe.color,
            icon,
            classe,
            calendar: {
              bgColor: classe.color,
              borderColor: classe.color,
              icon,
            },
          },
        };

        function pushEvent(event, startDate, endDate) {
          if (startDate.toDateString() !== endDate.toDateString()) {
            // Create the first event ending at 23:59 on the start day
            const endOfStartDay = new Date(startDate);
            endOfStartDay.setHours(23, 59, 59, 999);
            events.push({
              ...event,
              end: endOfStartDay,
            });

            // Create the second event starting at 00:00 on the next day of the start day
            const startOfNextDay = new Date(endDate);
            startOfNextDay.setHours(0, 0, 0, 0);
            events.push({
              ...event,
              start: startOfNextDay,
            });

            crossDayEvents = true;
          } else {
            // Original logic for pushing a single event
            events.push({
              ...event,
              start: startDate,
              end: endDate,
            });
          }
        }

        pushEvent(newEvent, start, end);
        const { start: s1, end: e1 } = getDates(dayWeek - 7);
        pushEvent(newEvent, s1, e1);

        const { start: s2, end: e2 } = getDates(dayWeek + 7);
        pushEvent(newEvent, s2, e2);
      });
    }
  });
  if (_.isArray(breaks) && breaks.length) {
    _.forEach(breaks, (bbreak, i) => {
      _.forEach([...new Array(21).keys()], (index) => {
        const start = new Date(bbreak.startDate);
        const end = new Date(bbreak.endDate);
        start.setDate(first + index - 7);
        end.setDate(first + index - 7);
        start.setSeconds(0, 0);
        end.setSeconds(0, 0);

        events.push({
          id: `break-${i}`,
          title: bbreak.name,
          allDay: false,
          start,
          end,
          display: 'background',
          component: (
            <Box
              sx={(theme) => ({
                display: 'flex',
                width: 'calc(100% + 0.5rem)',
                height: 'calc(100% + 0.5rem)',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.colors.interactive03h,
                margin: '-0.25rem',
              })}
            >
              <Text role="productive" transform="uppercase">
                {bbreak.name}
              </Text>
            </Box>
          ),
          originalEvent: {
            title: bbreak.name,
            break: bbreak,
            calendar: {},
          },
        });
      });
    });
  }
  return [events, crossDayEvents];
}
