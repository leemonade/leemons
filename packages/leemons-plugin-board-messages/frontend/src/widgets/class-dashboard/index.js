import { getActiveRequest } from '@board-messages/request';
import { getCentersWithToken } from '@users/session';
import PropTypes from 'prop-types';
import React from 'react';

function ClassDashboard({ classe }) {
  async function load() {
    const result = await getActiveRequest({
      center: getCentersWithToken()[0].id,
      classe: classe.id,
      program: classe.program,
      zone: 'class-dashboard',
    });
    console.log(result);
  }

  React.useEffect(() => {
    if (classe) {
      load();
    }
  }, [classe]);

  return 'Gatitos powa';
}

ClassDashboard.propTypes = {
  classe: PropTypes.object,
  session: PropTypes.object,
  inTab: PropTypes.bool,
};

export default ClassDashboard;
