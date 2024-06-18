import React from 'react';
import PropTypes from 'prop-types';

import { Box, ImageLoader, CardEmptyCover } from '@bubbles-ui/components';

import prepareAsset from '@leebrary/helpers/prepareAsset';
import { useAvatarActivityStyles } from './AvatarActivity.styles';

// eslint-disable-next-line import/prefer-default-export
export function AvatarActivity({ activity }) {
  const activityColor = activity?.asset?.color;

  const preparedAsset = prepareAsset(activity?.asset);
  const { classes } = useAvatarActivityStyles({ activityColor });

  return (
    <Box className={classes.cover}>
      {preparedAsset?.cover ? (
        <ImageLoader src={preparedAsset?.cover} height={48} width={72} radius={4} />
      ) : (
        <Box style={{ width: 72, height: 48 }}>
          <CardEmptyCover icon={''} fileType={preparedAsset?.fileType ?? 'test'} height={48} />
        </Box>
      )}
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
