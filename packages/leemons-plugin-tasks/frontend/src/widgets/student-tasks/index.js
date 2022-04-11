/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import UserAssignedTasksList from '../../components/Ongoing/UserAssignedTasksList';

function StudentTasksWidget({ classe }) {
  return <UserAssignedTasksList defaultFilters={{ group: classe.id }} showFilters={false} />;
}

StudentTasksWidget.propTypes = {
  classe: PropTypes.object.isRequired,
};

export default StudentTasksWidget;
