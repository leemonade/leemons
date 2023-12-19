import React from 'react';
import PropTypes from 'prop-types';
import { LocaleDate, useLocale } from '@common';
import { Box } from '@bubbles-ui/components';
import { PluginCalendarIcon } from '@bubbles-ui/icons/outline';
import useDateStyles from './Date.styles';

export default function Date({ instance, hidden }) {
  const deadline = instance?.dates?.deadline;

  const { classes } = useDateStyles();

  if (!deadline || hidden) {
    return null;
  }

  return (
    <Box className={classes.root}>
      <Box className={classes.icon}>
        <PluginCalendarIcon width={18} height={18} />
      </Box>
      <Box className={classes.text}>
        <LocaleDate date={deadline} options={{ dateStyle: 'short' }} />
      </Box>
    </Box>
  );
}

Date.propTypes = {
  instance: PropTypes.shape({
    dates: PropTypes.shape({ deadline: PropTypes.string }),
  }),
  hidden: PropTypes.bool,
};
