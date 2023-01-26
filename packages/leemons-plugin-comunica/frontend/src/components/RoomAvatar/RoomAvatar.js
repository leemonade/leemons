import React from 'react';
import { Box, ImageLoader } from '@bubbles-ui/components';
import PropTypes from 'prop-types';
import { getAssetUrl } from '@leebrary/helpers/prepareAsset';
import { RoomAvatarStyles } from './RoomAvatar.styles';

function RoomAvatar({ room, size = 56 }) {
  const { classes } = RoomAvatarStyles(
    {
      imageSquare: room.type === 'plugins.assignables.assignation',
      size,
    },
    { name: 'RoomAvatar' }
  );
  const avatar = React.useMemo(() => {
    const result = {};
    if (room.image) {
      result.image = (
        <ImageLoader
          className={classes.image}
          src={room.imageIsUrl ? room.image : getAssetUrl(room.image)}
          forceImage
          width={size}
          height={size}
        />
      );
    }
    if (!room.image && room.icon) {
      result.icon = (
        <ImageLoader
          src={room.metadata.iconIsUrl ? room.icon : getAssetUrl(room.icon)}
          forceImage
          width={result.image ? size * 0.2142 : size * 0.4642}
          height={result.image ? size * 0.2142 : size * 0.4642}
        />
      );
    }
    if (room.attached) {
      result.attached = (
        <ImageLoader
          src="/public/assets/svgs/attached.svg"
          forceImage
          width={size * 0.2142}
          height={size * 0.2142}
        />
      );
    }
    if (room.bgColor) {
      result.color = room.bgColor;
    }
    return result;
  }, [room.icon, room.attached, room.image, room.bgColor]);

  return (
    <Box className={classes.itemImage}>
      <Box className={classes.itemContent}>
        {/* eslint-disable-next-line no-nested-ternary */}
        {avatar.image ? (
          <>
            {avatar.image}
            {avatar.attached ? <Box className={classes.attachedIcon}>{avatar.attached}</Box> : null}
          </>
        ) : avatar.icon ? (
          <>
            <Box style={{ backgroundColor: avatar.color }} className={classes.itemIconContainer}>
              {avatar.icon}
            </Box>
            {avatar.attached ? <Box className={classes.attachedIcon}>{avatar.attached}</Box> : null}
          </>
        ) : null}
      </Box>
    </Box>
  );
}

RoomAvatar.propTypes = {
  room: PropTypes.any,
  size: PropTypes.number,
};

export { RoomAvatar };
export default RoomAvatar;
