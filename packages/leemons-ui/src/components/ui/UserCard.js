import React from 'react';
import PropTypes from 'prop-types';

function User({ children, className }) {
  return <div className={`card ${className || ''}`}>{children}</div>;
}

User.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
};

export default User;
