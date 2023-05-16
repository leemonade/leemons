import React from 'react';
import PropTypes from 'prop-types';
import AssignmentList from './AssignmentList';

export default function Ongoing({ closed = false, ...props }) {
  return (
    <>
      <AssignmentList archived={closed} {...props} />
    </>
  );
}

Ongoing.propTypes = {
  closed: PropTypes.bool,
};
