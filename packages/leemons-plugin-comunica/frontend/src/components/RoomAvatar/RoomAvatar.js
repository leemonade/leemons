import { Avatar, Box, ImageLoader } from '@bubbles-ui/components';
import { getAssetUrl } from '@leebrary/helpers/prepareAsset';
import selectFile from '@leebrary/helpers/selectFile';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { RoomAvatarStyles } from './RoomAvatar.styles';

function RoomAvatar({ room, isHeader, onImageChange, size = 56 }) {
  const { classes } = RoomAvatarStyles(
    {
      imageSquare: [
        isHeader ? 'plugins.assignables.assignation.user' : null,
        isHeader ? 'plugins.assignables.assignation.group' : null,
        isHeader ? 'plugins.assignables.assignation.subject' : null,
        'plugins.assignables.assignation',
      ].includes(room.type),
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
    let { image, icon, bgColor, imageIsUser, imageIsUrl } = room;
    if (isHeader && room.metadata?.headerImage) {
      image = room.metadata.headerImage;
    }
    if (isHeader && room.metadata?.headerIcon) {
      icon = room.metadata.headerIcon;
    }
    if (isHeader && room.metadata?.headerBgColor) {
      bgColor = room.metadata.headerBgColor;
    }
    // eslint-disable-next-line no-prototype-builtins
    if (isHeader && room.metadata?.hasOwnProperty('headerImageIsUser')) {
      imageIsUser = room.metadata.headerImageIsUser;
    }
    // eslint-disable-next-line no-prototype-builtins
    if (isHeader && room.metadata?.hasOwnProperty('headerImageIsUrl')) {
      imageIsUrl = room.metadata.headerImageIsUrl;
    }
    if (image) {
      if (imageIsUser) {
        result.image = (
          <Avatar image={image} fullName={room.name} size={size === 56 ? 'lg' : 'md'} />
        );
      } else {
        result.image = (
          <ImageLoader
            className={classes.image}
            src={`${imageIsUrl ? image : getAssetUrl(image)}&seed=${room.imageSeed}`}
            forceImage
            withPlaceholder
            placeholder={
              <Avatar
                color="#D3D5D9"
                radius={false}
                fullName={room.name}
                size={size === 56 ? 'lg' : 'md'}
              />
            }
            width={size}
            height={size}
          />
        );
      }
    }
    if (!image && icon) {
      result.icon = (
        <ImageLoader
          src={room.metadata.iconIsUrl ? icon : getAssetUrl(icon)}
          forceImage
          withPlaceholder
          placeholder={
            <Avatar
              color="#D3D5D9"
              radius={false}
              fullName={room.name}
              size={size === 56 ? 'lg' : 'md'}
            />
          }
          width={result.image ? size * 0.2142 : size * 0.4642}
          height={result.image ? size * 0.2142 : size * 0.4642}
        />
      );
    }
    if (!image && !icon) {
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
    if (bgColor) {
      result.color = bgColor;
    }
    return result;
  }, [room.icon, room.attached, room.image, room.metadata, room.bgColor, room.imageSeed]);

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
  isHeader: PropTypes.boolean,
  onImageChange: PropTypes.func,
};

export { RoomAvatar };
export default RoomAvatar;
