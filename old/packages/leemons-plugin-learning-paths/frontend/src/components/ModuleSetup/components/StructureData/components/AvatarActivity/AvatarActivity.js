import React from 'react';
import PropTypes from 'prop-types';

import { Box, ImageLoader } from '@bubbles-ui/components';

import prepareAsset from '@leebrary/helpers/prepareAsset';
import { isString } from 'lodash';
import { useAvatarActivityStyles } from './AvatarActivity.styles';

// eslint-disable-next-line import/prefer-default-export
export function AvatarActivity({ activity }) {
  const activityColor = activity?.asset?.color;
  const activityTypeIcon = activity.roleDetails.icon;

  const preparedAsset = prepareAsset(activity?.asset);

  const iconIsUrl = isString(activityTypeIcon);

  const { classes } = useAvatarActivityStyles({ activityColor });

  return (
    <Box className={classes.cover}>
      {preparedAsset?.cover ? (
        <ImageLoader src={preparedAsset?.cover} width={40} height={40} />
      ) : (
        <Box className={classes.coverFallback} />
      )}
      <Box className={classes.activityType}>
        <Box className={classes.activityTypeIcon}>
          {iconIsUrl ? (
            <ImageLoader src={activityTypeIcon} width={12} height={12} />
          ) : (
            activityTypeIcon
          )}
        </Box>
      </Box>
    </Box>
  );
}

AvatarActivity.propTypes = {
  activity: PropTypes.shape({
    asset: PropTypes.shape({
      name: PropTypes.string,
      color: PropTypes.string,
    }),
    roleDetails: PropTypes.shape({
      icon: PropTypes.element,
    }),
  }),
};
