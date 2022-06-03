/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { UserDisplayItem } from '@bubbles-ui/components';
import UserDetailModal from '@users/components/UserDetailModal';

function ClassStudentsWidget({ classe }) {
  const [openedStudent, setOpenedStudent] = React.useState();

  function openStudent(student) {
    setOpenedStudent(student);
  }

  function closeStudent() {
    setOpenedStudent(null);
  }

  return (
    <>
      <UserDetailModal
        opened={!!openedStudent}
        userAgent={openedStudent?.id}
        onClose={closeStudent}
      />
      {classe?.students.map((student) => (
        <UserDisplayItem
          style={{ cursor: 'pointer' }}
          onClick={() => openStudent(student)}
          key={student.id}
          {...student.user}
          variant="inline"
          noBreak={true}
        />
      ))}
    </>
  );
}

ClassStudentsWidget.propTypes = {
  classe: PropTypes.object.isRequired,
};

export default ClassStudentsWidget;
