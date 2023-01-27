import React from 'react';
import PropTypes from 'prop-types';
import { Box, ImageLoader } from '@bubbles-ui/components';
import { RoomAvatar } from '@comunica/components';
import { getAssetUrl } from '@leebrary/helpers/prepareAsset';
import { VolumeControlOffIcon } from '@bubbles-ui/icons/solid';
import { RoomHeaderStyles } from './RoomHeader.styles';

function RoomHeader({ room, t, onImageChange }) {
  const { classes } = RoomHeaderStyles({}, { name: 'RoomHeader' });

  const subNameIcon = React.useMemo(() => {
    if (room.type === 'plugins.assignables.assignation') {
      if (room.subName === 'multisubjects') {
        return (
          <Box className={classes.icon} style={{ backgroundColor: '#67728E' }}>
            <ImageLoader
              forceImage
              src="/public/assets/svgs/module-three.svg"
              width={14}
              height={14}
            />
          </Box>
        );
      }
      return (
        <Box className={classes.icon} style={{ backgroundColor: room.bgColor }}>
          <ImageLoader forceImage src={getAssetUrl(room.icon)} width={14} height={14} />
        </Box>
      );
    }
    return null;
  }, [room]);

  return (
    <Box className={classes.container}>
      <Box className={classes.leftSide}>
        <RoomAvatar onImageChange={onImageChange} room={room} />
        <Box>
          {room.name ? (
            <Box className={classes.title}>{t(room.name, room.nameReplaces, false, room.name)}</Box>
          ) : null}

          {room.subName ? (
            <Box className={classes.subNameContainer}>
              {subNameIcon}
              <Box className={classes.subName}>{t(room.subName, {}, false, room.subName)}</Box>
            </Box>
          ) : null}
        </Box>
      </Box>
      <Box className={classes.rightSide}>
        {room.muted ? (
          <Box className={classes.muteIcon}>
            <VolumeControlOffIcon />
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}

RoomHeader.propTypes = {
  t: PropTypes.func,
  room: PropTypes.any,
  onImageChange: PropTypes.func,
};

export { RoomHeader };
export default RoomHeader;
