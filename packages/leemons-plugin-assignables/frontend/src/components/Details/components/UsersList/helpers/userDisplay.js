import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { UserDisplayItem } from '@bubbles-ui/components';
import { getUserAgentsInfoRequest } from '@users/request';

export default function UserDisplay(props) {
  return <UserDisplayItem {...props} />;
}

UserDisplay.propTypes = {
  id: PropTypes.string.isRequired,
};
