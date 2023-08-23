import React from 'react';
import PropTypes from 'prop-types';

import { Box, Text, TextClamp, createStyles } from '@bubbles-ui/components';

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
      ...globalTheme.content.typo.body.sm,
    },
    lastUpdate: {
      ...globalTheme.content.typoMobile.caption,
      lineHeight: '16px',
      color: globalTheme.content.color.text.subtle,
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
          {localizations?.lastUpdate}: <LocaleDate date={activity.updated_at || null} />
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
    updated_at: PropTypes.instanceOf(Date),
  }),
};
