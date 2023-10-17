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

  _.forEach(classes, (classe) => {
    if (classe.showEvents) {
      const title = `${classe.subject.name} (${classe.groups.abbreviation})`;
      const icon = classe.subject.icon ? getAssetUrl(classe.subject.icon.id) : null;
      _.forEach(classe.schedule, (schedule, i) => {
        function getDates(dayWeek) {
          curr = new Date();
          curr.setDate(first + dayWeek);
          const start = new Date(curr);
          const end = new Date(curr);
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

        events.push(newEvent);
        const { start: s1, end: e1 } = getDates(dayWeek - 7);
        events.push({
          ...newEvent,
          start: s1,
          end: e1,
        });
        const { start: s2, end: e2 } = getDates(dayWeek + 7);
        events.push({
          ...newEvent,
          start: s2,
          end: e2,
        });
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
  return events;
}
