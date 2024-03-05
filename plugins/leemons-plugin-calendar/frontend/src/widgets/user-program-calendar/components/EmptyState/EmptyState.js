import React from 'react';
import { Stack, Text, ImageLoader } from '@bubbles-ui/components';
import CalendarImage from '@calendar/assets/emptyState/calendar.svg';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@calendar/helpers/prefixPN';
import { RenderTextWithCTAs } from '@common';
import { useEmptyStateStyles } from './EmptyState.styles';

export function EmptyState() {
  const [t] = useTranslateLoader(prefixPN('emptyState.calendar'));

  const { classes, cx } = useEmptyStateStyles();

  return (
    <Stack direction="column" spacing={8}>
      <Stack direction="column" spacing={4}>
        <Text color="primary" className={cx(classes.text, classes.title)}>
          {t('title')}
        </Text>
        <RenderTextWithCTAs
          t={t}
          text="description"
          replacers={{
            newCTA: { type: 'linkT', value: 'newCTA' },
            menuCTA: { type: 'linkT', value: 'menuCTA', url: leemons.HELPDESK_URL },
          }}
        />
      </Stack>
      <ImageLoader src={CalendarImage} style={{ position: 'relative' }} />
    </Stack>
  );
}

export default EmptyState;
