import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  UserDisplayItem,
  Text,
  ActionButton,
  ActivityAccordion,
  ActivityAccordionPanel,
} from '@bubbles-ui/components';
import {
  RemoveIcon,
  SchoolTeacherMaleIcon,
  SingleActionsGraduateIcon,
} from '@bubbles-ui/icons/outline';
import { isFunction } from 'lodash';
import { MembersListStyles } from './MembersList.styles';

function MembersList({ opened, onClose }) {
  const { classes } = MembersListStyles({ opened }, { name: 'MembersList' });

  const onCloseHandler = () => {
    isFunction(onClose) && onClose();
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <ActionButton icon={<RemoveIcon height={16} width={16} />} onClick={onCloseHandler} />
      </Box>
      <Text role="productive" color="primary" stronger size="lg" className={classes.title}>
        Miembros
      </Text>
      <ActivityAccordion>
        <ActivityAccordionPanel label="Profesores" icon={<SchoolTeacherMaleIcon />}>
          <Box className={classes.userWrapper}>
            <UserDisplayItem name="Anotonio" surnames="Gonzalez Miau" />
          </Box>
        </ActivityAccordionPanel>
        <ActivityAccordionPanel label="Alumnos" icon={<SingleActionsGraduateIcon />}>
          <Box className={classes.userWrapper}>
            <UserDisplayItem name="Marcelina" />
          </Box>
          <Box className={classes.userWrapper}>
            <UserDisplayItem name="Marcelina" />
          </Box>
        </ActivityAccordionPanel>
      </ActivityAccordion>
    </Box>
  );
}

MembersList.propTypes = {
  opened: PropTypes.bool,
  onClose: PropTypes.func,
  teachers: PropTypes.array,
  students: PropTypes.array,
};

export { MembersList };
export default MembersList;
