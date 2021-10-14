import React from 'react';
import PropTypes from 'prop-types';

function UserCard({ children, className }) {
  return <div className={`user-card ${className || ''}`}>{children}</div>;
}

UserCard.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
};

export default UserCard;
