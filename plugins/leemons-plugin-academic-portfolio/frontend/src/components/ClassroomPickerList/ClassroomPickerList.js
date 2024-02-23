import React from 'react';
import { Box } from '@bubbles-ui/components';
import propTypes from 'prop-types';
import { ClassroomPickerItem } from '../ClassroomPicker/components/ClassroomPickerItem';

const ClassroomPickerList = ({ subjects, onRemove }) => (
  <Box>
    {subjects?.length > 0 &&
      subjects.map((subject) => (
        <ClassroomPickerItem
          {...subject}
          onRemove={() => onRemove(subject)}
          canRemove
          key={subject.id}
        />
      ))}
  </Box>
);

ClassroomPickerList.propTypes = {
  subjects: propTypes.arrayOf(propTypes.shape({})),
  onRemove: propTypes.func,
};

export { ClassroomPickerList };
