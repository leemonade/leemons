import { Avatar, Box, ImageLoader } from '@bubbles-ui/components';
import { VolumeControlOffIcon } from '@bubbles-ui/icons/solid';
import { RoomAvatar } from '@comunica/components';
import RoomInstanceView from '@comunica/components/RoomInstanceView/RoomInstanceView';
import { getName } from '@comunica/helpers/getRoomParsed';
import isTeacherByRoom from '@comunica/helpers/isTeacherByRoom';
import { getAssetUrl } from '@leebrary/helpers/prepareAsset';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { RoomHeaderStyles } from './RoomHeader.styles';

const noNUsersTypes = [
  'plugins.assignables.assignation',
  'plugins.assignables.assignation.subject',
  'chat',
];

const showViewTypes = ['plugins.assignables.assignation', 'plugins.assignables.assignation.user'];

function RoomHeader({ room, t, onImageChange }) {
  const { classes } = RoomHeaderStyles({ type: room.type }, { name: 'RoomHeader' });

  const nUsers = _.filter(room.userAgents, (e) => !e.deleted).length;

  const subNameIcon = React.useMemo(() => {
    if (
      [
        'plugins.assignables.assignation.subject',
        'plugins.assignables.assignation.user',
        'plugins.assignables.assignation.group',
        'plugins.assignables.assignation',
      ].includes(room.type)
    ) {
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

      const isTeacher = isTeacherByRoom(room);
      if (isTeacher && room.type === 'plugins.assignables.assignation.user') {
        const student = _.find(
          _.map(room.userAgents, 'userAgent'),
          (userAgent) => userAgent?.profile?.sysName === 'student'
        );
        return <Avatar image={room.image} fullName={getName(student)} size="xs" />;
      }
      return (
        <Box className={classes.icon} style={{ backgroundColor: room.bgColor }}>
          <ImageLoader
            forceImage
            src={room.iconIsUrl || room.metadata?.iconIsUrl ? room.icon : getAssetUrl(room.icon)}
            width={14}
            height={14}
          />
        </Box>
      );
    }
    return null;
  }, [room]);

  return (
    <Box className={classes.container}>
      <Box className={classes.leftSide}>
        <RoomAvatar onImageChange={onImageChange} isHeader={true} room={room} />
        <Box className={classes.textsContainer}>
          {room.metadata?.headerName || room.name ? (
            <Box className={classes.title}>
              {t(
                room.metadata?.headerName || room.name,
                room.nameReplaces,
                false,
                room.metadata?.headerName || room.name
              )}
            </Box>
          ) : null}

          {room.metadata?.headerSubName || room.subName ? (
            <Box className={classes.subNameContainer}>
              {subNameIcon}
              <Box className={classes.subName}>
                {t(
                  room.metadata?.headerSubName || room.subName,
                  room.metadata?.headerSubNameReplaces || {},
                  false,
                  room.metadata?.headerSubName || room.subName
                )}{' '}
                {room.type !== 'group' ? ` (${nUsers})` : null}
              </Box>
              {room.type === 'group' ? (
                <Box className={classes.nsubName}>
                  {!noNUsersTypes.includes(room.type) ? `(${nUsers})` : null}
                </Box>
              ) : null}
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
        {showViewTypes.includes(room.type) ? (
          <RoomInstanceView key={room?.id} room={room} t={t} />
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
