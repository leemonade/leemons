import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@bubbles-ui/components';
import { useStore } from '@common';
import { listDetailPageRequest } from '../../request';

function UserDetailWidget({ user }) {
  const [store, render] = useStore();

  async function load() {
    const data = await listDetailPageRequest(user.id);
    console.log(data);
  }

  React.useEffect(() => {
    if (user) load();
  }, [user]);

  return <Box>Gatitos familia</Box>;
}

UserDetailWidget.propTypes = {
  user: PropTypes.object.isRequired,
};

export default UserDetailWidget;
