import React from 'react';
import PropTypes from 'prop-types';
import { Stack, Box, ActionButton } from '@bubbles-ui/components';
import { SelectUserAgent } from '@users/components';
import { DeleteBinIcon } from '@bubbles-ui/icons/solid';
import StudentsTable from '../SubjectView/StudentsTable';

const StudentsSelectByUserData = ({
  centerId,
  setSelectedStudents,
  selectedStudents,
  studentProfile,
  localizations,
  previouslyEnrolledStudents = [], // Used only when the drawer is open from a subject node
}) => {
  // HANDLERS && FUNCTIONS ············································································································|
  const handleRemoveStudent = (studentToRemove) => {
    setSelectedStudents((currentStudents) =>
      currentStudents.filter((student) => student.id !== studentToRemove.id)
    );
  };

  const handleOnAddStudent = (studentToAdd) => {
    setSelectedStudents((current) => [
      ...current,
      {
        ...studentToAdd,
        actions: (
          <ActionButton
            onClick={() => handleRemoveStudent(studentToAdd)}
            tooltip={localizations?.remove}
            icon={<DeleteBinIcon width={18} height={18} />}
          />
        ),
      },
    ]);
  };

  return (
    <Stack direction="column">
      <Box sx={{ padding: '24px' }}>
        <SelectUserAgent
          centers={centerId}
          profiles={studentProfile}
          selectedUserAgents={[
            ...previouslyEnrolledStudents.concat(selectedStudents).map(({ value }) => value),
          ]}
          onChange={(studentToAdd) => handleOnAddStudent(studentToAdd)}
          returnItem
        />
      </Box>
      {selectedStudents?.length > 0 && <StudentsTable data={selectedStudents} />}
    </Stack>
  );
};

StudentsSelectByUserData.propTypes = {
  centerId: PropTypes.string.isRequired,
  selectedStudents: PropTypes.array,
  previouslyEnrolledStudents: PropTypes.array,
  setSelectedStudents: PropTypes.func.isRequired,
  studentProfile: PropTypes.string.isRequired,
  localizations: PropTypes.object,
};

export default StudentsSelectByUserData;
