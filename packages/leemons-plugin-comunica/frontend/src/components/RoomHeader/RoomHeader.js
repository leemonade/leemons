import React from 'react';
import PropTypes from 'prop-types';
import { Box, ImageLoader, Text, Title } from '@bubbles-ui/components';
import { RoomAvatar } from '@comunica/components';
import { getAssetUrl } from '@leebrary/helpers/prepareAsset';
import { RoomHeaderStyles } from './RoomHeader.styles';

function RoomHeader({ room, t }) {
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
        <RoomAvatar room={room} />
        <Box>
          {room.name ? (
            <Box>
              <Title order={3}>{t(room.name, {}, false, room.name)}</Title>
            </Box>
          ) : null}

          {room.subName ? (
            <Box className={classes.subNameContainer}>
              {subNameIcon}
              <Box className={classes.subName}>
                <Text role="productive">{t(room.subName, {}, false, room.subName)}</Text>
              </Box>
            </Box>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
}

RoomHeader.propTypes = {
  t: PropTypes.func,
  room: PropTypes.any,
};

export { RoomHeader };
export default RoomHeader;
