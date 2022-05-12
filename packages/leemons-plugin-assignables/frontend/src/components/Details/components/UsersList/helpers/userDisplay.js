import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { UserDisplayItem } from '@bubbles-ui/components';
import { getUserAgentsInfoRequest } from '@users/request';

export default function UserDisplay({ id }) {
  const [data, setData] = useState(null);

  useEffect(async () => {
    const usersInfo = await getUserAgentsInfoRequest(id);
    setData(usersInfo);
  }, [id]);

  let user;
  if (data?.userAgents?.length) {
    user = data.userAgents[0].user;
  }

  return <UserDisplayItem {...user} />;
}

UserDisplay.propTypes = {
  id: PropTypes.string.isRequired,
};
