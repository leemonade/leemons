import React from 'react';
import PropTypes from 'prop-types';
import { Stack, Text, createStyles } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@academic-calendar/helpers/prefixPN';
import ColorBall from './ColorBall';

const useStyles = createStyles((theme) => ({
  root: { border: `1px solid ${theme.colors.ui01}`, padding: 16, borderRadius: 4 },
}));

const CalendarKey = () => {
  const [t] = useTranslateLoader(prefixPN('calendarKey'));
  const { classes } = useStyles({});

  return (
    <Stack fullWidth spacing={8} className={classes.root}>
      <Stack direction="column" spacing={3} skipFlex>
        <Stack alignItems="center">
          <ColorBall
            sx={(theme) => ({ marginRight: theme.spacing[4] })}
            colors="white"
            isSquare
            withBorder
          />
          <Text>{t('specialSchoolDay')}</Text>
        </Stack>
        <Stack alignItems="center">
          <ColorBall
            sx={(theme) => ({ marginRight: theme.spacing[4] })}
            colors="black"
            isSquare
            withArrow
          />
          <Text>{t('courseStartEnd')}</Text>
        </Stack>
        <Stack alignItems="center">
          <ColorBall
            sx={(theme) => ({ marginRight: theme.spacing[4] })}
            isSquare
            withArrow
            colors="transparent"
          />
          <Text>{t('subStageStartEnd')}</Text>
        </Stack>
      </Stack>
      <Stack direction="column" spacing={3} skipFlex>
        <Stack alignItems="center">
          <ColorBall
            sx={(theme) => ({ marginRight: theme.spacing[4] })}
            colors={['#DEEDE4', '#D5E4DB']}
          />
          <Text>{t('regionalEvents')}</Text>
        </Stack>
        <Stack alignItems="center">
          <ColorBall
            sx={(theme) => ({ marginRight: theme.spacing[4] })}
            colors={['#E4DDF7', '#DBD4ED']}
            rotate={90}
          />
          <Text>{t('localEvents')}</Text>
        </Stack>
        <Stack alignItems="center">
          <ColorBall
            sx={(theme) => ({ marginRight: theme.spacing[4] })}
            colors={['#F6E1F3', '#ECD8E9']}
            rotate={-45}
          />
          <Text>{t('daysOffEvents')}</Text>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default CalendarKey;

CalendarKey.propTypes = {};
