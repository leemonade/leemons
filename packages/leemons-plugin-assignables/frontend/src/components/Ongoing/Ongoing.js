import React from 'react';
import PropTypes from 'prop-types';
import AssignmentList from './AssignmentList';

export default function Ongoing({ closed = false }) {
  return (
    <>
      <AssignmentList closed={closed} />
    </>
  );
}

Ongoing.propTypes = {
  closed: PropTypes.bool,
};
