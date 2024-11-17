import React from 'react';
import PropTypes from 'prop-types';
import { Box, ImageLoader, Text } from '@bubbles-ui/components';
import useRolesLocalizations from '@assignables/hooks/useRolesLocalizations';
import { useActivityTypeStyles } from './ActivityType.styles';

export default function ActivityTypeDisplay({ assignable, hidden }) {
  const rolesLocalizations = useRolesLocalizations([assignable?.role]);
  const icon = assignable?.roleDetails?.icon;
  const name = rolesLocalizations?.[assignable?.role];

  const { classes } = useActivityTypeStyles();

  if (hidden) {
    return null;
  }

  return (
    <Box className={classes.root}>
      <Box className={classes.icon}>
        <ImageLoader src={icon} />
      </Box>
      <Box className={classes.text}>
        <Text transform="capitalize">{name?.singular}</Text>
      </Box>
    </Box>
  );
}

ActivityTypeDisplay.propTypes = {
  assignable: PropTypes.shape({
    roleDetails: PropTypes.shape({
      icon: PropTypes.string,
      name: PropTypes.string,
    }),
  }),
  hidden: PropTypes.bool,
};
