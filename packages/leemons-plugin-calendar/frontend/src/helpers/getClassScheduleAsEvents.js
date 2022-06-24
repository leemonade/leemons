import React from 'react';
import _ from 'lodash';
import { getAssetUrl } from '@leebrary/helpers/prepareAsset';
import { Box, Text } from '@bubbles-ui/components';

export default function getClassScheduleAsEvents(_classe, breaks) {
  const classes = _.isArray(_classe) ? _classe : [_classe];
  const events = [];
  const curr = new Date(); // get current date
  const first = curr.getDate() - curr.getDay();

  _.forEach(classes, (classe) => {
    if (classe.showEvents) {
      const title = `${classe.subject.name} (${classe.groups.abbreviation})`;
      const icon = classe.subject.icon ? getAssetUrl(classe.subject.icon.id) : null;
      _.forEach(classe.schedule, (schedule, i) => {
        let { dayWeek } = schedule;
        if (dayWeek === 0) {
          dayWeek = 7;
        }
        const start = new Date(curr.setDate(first + dayWeek));
        const end = new Date(curr.setDate(first + dayWeek));
        const startSplit = schedule.start.split(':');
        const endSplit = schedule.end.split(':');
        start.setHours(parseInt(startSplit[0], 10), parseInt(startSplit[1], 10), 0);
        end.setHours(parseInt(endSplit[0], 10), parseInt(endSplit[1], 10), 59);
        events.push({
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
        });
      });
    }
  });
  if (_.isArray(breaks) && breaks.length) {
    _.forEach(breaks, (bbreak, i) => {
      events.push({
        id: `break-${i}`,
        title: bbreak.name,
        allDay: false,
        start: new Date(bbreak.startDate),
        end: new Date(bbreak.endDate),
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
            <Text size="lg" role="productive">
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
  }
  return events;
}
