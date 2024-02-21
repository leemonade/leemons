import React from 'react';
import propTypes from 'prop-types';
import { Box, AvatarSubject, Text, IconButton, ChipsContainer } from '@bubbles-ui/components';
import { DeleteBinIcon } from '@bubbles-ui/icons/outline';
import { BlockIcon } from '@bubbles-ui/icons/solid';
import { noop } from 'lodash';
// import { ChipsContainer } from '../../ChipsContainer';
import { ClassroomPickerItemStyles } from './ClassroomPickerItem.styles';

const ClassroomPickerItem = ({
  label,
  schedule,
  subjectColor,
  subjectIcon,
  subjectName,
  value,
  onRemove = noop,
  canRemove = false,
  isCollisionDetected,
}) => {
  const { classes } = ClassroomPickerItemStyles(
    { canRemove, isCollisionDetected },
    { name: 'ClassroomPickerItem' }
  );
  return (
    <Box className={classes.root}>
      <Box className={classes.containerSubject}>
        <AvatarSubject color={subjectColor} icon={subjectIcon} size="md" />
        <Text className={classes.label}>{subjectName}</Text>
      </Box>
      <Box className={classes.containerSchedule}>
        <ChipsContainer
          subjects={schedule}
          chipsToShow={2}
          isCollisionDetected={isCollisionDetected}
        />
        {isCollisionDetected && <BlockIcon className={classes.collisionIcon} />}
        {canRemove && (
          <IconButton onClick={onRemove} icon={<DeleteBinIcon width={24} height={24} />} />
        )}
      </Box>
    </Box>
  );
};

export { ClassroomPickerItem };

ClassroomPickerItem.propTypes = {
  label: propTypes.string,
  schedule: propTypes.string,
  subjectColor: propTypes.string,
  subjectIcon: propTypes.string,
  subjectName: propTypes.string,
  value: propTypes.string,
  onRemove: propTypes.func,
  canRemove: propTypes.bool,
  isCollisionDetected: propTypes.bool,
};
