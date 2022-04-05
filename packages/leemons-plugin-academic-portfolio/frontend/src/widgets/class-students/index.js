/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import { UserDisplayItem } from '@bubbles-ui/components';

function ClassStudentsWidget({ classe }) {
  return classe.students.map((student) => (
    <UserDisplayItem key={student.id} {...student.user} variant="inline" noBreak={true} />
  ));
}

ClassStudentsWidget.propTypes = {
  classe: PropTypes.object.isRequired,
};

export default ClassStudentsWidget;
