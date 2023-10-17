import { BannerMessage } from '@board-messages/components';
import { getActiveRequest } from '@board-messages/request';
import { getCentersWithToken } from '@users/session';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

function ClassDashboard({ classe }) {
  const [activeMessage, setActiveMessage] = useState(null);

  async function load() {
    const { message } = await getActiveRequest({
      center: getCentersWithToken()[0].id,
      classe: classe.id,
      program: classe.program,
      zone: 'class-dashboard',
    });
    setActiveMessage(message);
  }

  React.useEffect(() => {
    if (classe) {
      load();
    }
  }, [classe]);

  if (!activeMessage) return null;

  return <BannerMessage message={activeMessage} />;
}

ClassDashboard.propTypes = {
  classe: PropTypes.object,
  session: PropTypes.object,
  inTab: PropTypes.bool,
};

export default ClassDashboard;
