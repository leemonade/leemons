import React from 'react';
import PropTypes from 'prop-types';
import { Stack, Text, ImageLoader } from '@bubbles-ui/components';
import CalendarImage from '@calendar/assets/emptyState/calendar.svg';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@calendar/helpers/prefixPN';
import { RenderTextWithCTAs } from '@common';
import { useEmptyStateStyles } from './EmptyState.styles';

function EmptyState({ onNewEvent }) {
  const [t] = useTranslateLoader(prefixPN('emptyState.calendar'));

  const { classes, cx } = useEmptyStateStyles();

  return (
    <Stack direction="row" spacing={8} justifyContent="center" alignItems="center" fullWidth>
      <ImageLoader src={CalendarImage} style={{ position: 'relative' }} />
      <Stack direction="column" alignItems="start" spacing={4} sx={{ maxWidth: 400 }}>
        <Text color="primary" className={cx(classes.text, classes.title)}>
          {t('title')}
        </Text>
        <RenderTextWithCTAs
          t={t}
          text="description"
          align="left"
          replacers={{
            newCTA: { type: 'actionT', value: 'newCTA', action: onNewEvent },
            menuCTA: {
              type: 'linkT',
              value: 'menuCTA',
              url: 'https://www.leemons.io/leemons-academy',
            },
          }}
        />
      </Stack>
    </Stack>
  );
}

EmptyState.propTypes = {
  onNewEvent: PropTypes.func,
};

export { EmptyState };
