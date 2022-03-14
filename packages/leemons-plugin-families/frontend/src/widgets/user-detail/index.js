import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@bubbles-ui/components';
import { useStore } from '@common';
import { forEach } from 'lodash';
import { listDetailPageRequest } from '../../request';

function UserDetailWidget({ user }) {
  const [store, render] = useStore({ families: [] });

  async function load() {
    const { data } = await listDetailPageRequest(user.id);
    store.families = [];
    forEach(data, (family) => {
      if (family.guardians.length || family.students.length) {
        store.families.push(family);
      }
    });
    render();
  }

  React.useEffect(() => {
    if (user) load();
  }, [user]);

  if (!store.families.length) return null;

  return <Box>Gatitos familia</Box>;
}

UserDetailWidget.propTypes = {
  user: PropTypes.object.isRequired,
};

export default UserDetailWidget;
