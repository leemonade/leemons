import React from 'react';
import PropTypes from 'prop-types';
import AssignmentList from './AssignmentList';

export default function Ongoing(props) {
  return (
    <>
      <AssignmentList archived {...props} />
    </>
  );
}

Ongoing.propTypes = {
  closed: PropTypes.bool,
};
