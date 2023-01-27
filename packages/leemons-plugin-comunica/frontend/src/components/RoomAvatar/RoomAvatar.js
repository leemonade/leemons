import React from 'react';
import _ from 'lodash';
import { Avatar, Box, ImageLoader } from '@bubbles-ui/components';
import PropTypes from 'prop-types';
import { getAssetUrl } from '@leebrary/helpers/prepareAsset';
import selectFile from '@leebrary/helpers/selectFile';
import { RoomAvatarStyles } from './RoomAvatar.styles';

function RoomAvatar({ room, onImageChange, size = 56 }) {
  const { classes } = RoomAvatarStyles(
    {
      imageSquare: room.type === 'plugins.assignables.assignation',
      size,
    },
    { name: 'RoomAvatar' }
  );

  async function click() {
    if (_.isFunction(onImageChange) && room.type === 'group') {
      const file = await selectFile();
      onImageChange(file[0]);
    }
  }

  const avatar = React.useMemo(() => {
    const result = {};
    if (room.image) {
      result.image = (
        <ImageLoader
          className={classes.image}
          src={`${room.imageIsUrl ? room.image : getAssetUrl(room.image)}&seed=${room.imageSeed}`}
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
    if (!room.image && !room.icon) {
      result.image = (
        <Avatar color="#D3D5D9" fullName={room.name} size={size === 56 ? 'lg' : 'md'} />
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
  }, [room.icon, room.attached, room.image, room.bgColor, room.imageSeed]);

  return (
    <Box className={classes.itemImage}>
      <Box className={classes.itemContent} onClick={click}>
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
  onImageChange: PropTypes.func,
};

export { RoomAvatar };
export default RoomAvatar;
