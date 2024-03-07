import React from 'react';
import PropTypes from 'prop-types';

import { Box, createStyles, Text, TextClamp } from '@bubbles-ui/components';

import { LocaleDate } from '@common';
import { AvatarActivity } from '../../../AvatarActivity';

export const useResourceRendererStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      display: 'flex',
      flexDirection: 'row',
      gap: globalTheme.spacing.padding.lg,
      alignItems: 'center',
    },
    textContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'start',
    },
    activityName: {
      ...globalTheme.content.typo.body['md--bold'],
      color: globalTheme.content.color.text.default,
    },
    lastUpdate: {
      ...globalTheme.content.typo.body.sm,
      color: globalTheme.content.color.text.muted,
    },
  };
});

export function ResourceRenderer({ activity, localizations }) {
  const { classes } = useResourceRendererStyles();
  return (
    <Box className={classes.root}>
      <AvatarActivity activity={activity} />
      <Box className={classes.textContainer}>
        <TextClamp lines={1}>
          <Text className={classes.activityName}>{activity.asset.name}</Text>
        </TextClamp>
        <Text className={classes.lastUpdate}>
          {localizations?.lastUpdate}:{' '}
          <LocaleDate
            date={activity.updatedAt || null}
            options={{
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            }}
          />
        </Text>
      </Box>
    </Box>
  );
}

ResourceRenderer.propTypes = {
  localizations: PropTypes.object,
  activity: PropTypes.shape({
    asset: PropTypes.shape({
      name: PropTypes.string,
    }),
    updatedAt: PropTypes.instanceOf(Date),
  }),
};
