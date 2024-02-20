import React from 'react';
import propTypes from 'prop-types';
import { Box, AvatarSubject, Text, IconButton } from '@bubbles-ui/components';
import { DeleteBinIcon } from '@bubbles-ui/icons/outline';
import { noop } from 'lodash';
import { ChipsContainer } from '../../ChipsContainer';
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
}) => {
  const { classes } = ClassroomPickerItemStyles({ canRemove }, { name: 'ClassroomPickerItem' });
  return (
    <Box className={classes.root}>
      <Box className={classes.containerSubject}>
        <AvatarSubject color={subjectColor} icon={subjectIcon} />
        <Text className={classes.label}>{subjectName}</Text>
      </Box>
      <Box className={classes.containerSchedule}>
        <ChipsContainer subjects={schedule} chipsToShow={2} />
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
};
