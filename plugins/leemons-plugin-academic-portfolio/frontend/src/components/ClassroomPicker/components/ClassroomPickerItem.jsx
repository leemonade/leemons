import React from 'react';
import propTypes from 'prop-types';
import { isString, noop } from 'lodash';
import { Box, AvatarSubject, Text, ActionButton } from '@bubbles-ui/components';
import { ChipsContainer } from '@common';
import { BlockIcon, DeleteBinIcon } from '@bubbles-ui/icons/solid';
import { getFileUrl } from '@leebrary/helpers/prepareAsset';
import { ClassroomPickerItemStyles } from './ClassroomPickerItem.styles';

const ClassroomPickerItem = ({
  schedule,
  subjectColor,
  subjectIcon,
  subjectName,
  onRemove = noop,
  canRemove = false,
  isCollisionDetected,
}) => {
  const { classes } = ClassroomPickerItemStyles(
    { canRemove, isCollisionDetected },
    { name: 'ClassroomPickerItem' }
  );

  function getIconURL(icon) {
    if (icon?.cover?.id) {
      return getFileUrl(icon.cover.id);
    }
    if (isString(icon?.cover)) {
      return getFileUrl(icon.cover);
    }

    if (isString(icon)) {
      return getFileUrl(icon);
    }
    return null;
  }
  const subjectIconUrl = getIconURL(subjectIcon);
  return (
    <Box className={classes.root}>
      <Box className={classes.containerSubject}>
        <AvatarSubject color={subjectColor} icon={subjectIconUrl} size="md" />
        <Text className={classes.label}>{subjectName}</Text>
      </Box>
      <Box className={classes.containerSchedule}>
        <ChipsContainer
          items={schedule}
          chipsToShow={2}
          isCollisionDetected={isCollisionDetected}
        />
        {isCollisionDetected && <BlockIcon className={classes.collisionIcon} />}
        {canRemove && (
          <ActionButton onClick={onRemove} icon={<DeleteBinIcon width={18} height={18} />} />
        )}
      </Box>
    </Box>
  );
};

export { ClassroomPickerItem };

ClassroomPickerItem.propTypes = {
  labels: propTypes.string,
  schedule: propTypes.string,
  subjectColor: propTypes.string,
  subjectIcon: propTypes.string,
  subjectName: propTypes.string,
  onRemove: propTypes.func,
  canRemove: propTypes.bool,
  isCollisionDetected: propTypes.bool,
};
