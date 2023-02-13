import { getActiveRequest } from '@board-messages/request';
import { getCentersWithToken } from '@users/session';
import PropTypes from 'prop-types';
import React from 'react';

function Dashboard({ program }) {
  async function load() {
    const result = await getActiveRequest({
      center: getCentersWithToken()[0].id,
      program: program.id,
      zone: 'dashboard',
    });
    console.log(result);
  }

  async function loadModal() {
    const { message } = await getActiveRequest({
      center: getCentersWithToken()[0].id,
      program: program.id,
      zone: 'dashboard',
    });
    if (message) {
      const boardMessagesModalId = window.sessionStorage.getItem('boardMessagesModalId');
      if (boardMessagesModalId !== message.id) {
        window.sessionStorage.setItem('boardMessagesModalId', message.id);
        // TODO: Mostrar modal
      }
    }
  }

  React.useEffect(() => {
    if (program) {
      load();
      loadModal();
    }
  }, [program]);

  return 'Gatitos';
}

Dashboard.propTypes = {
  program: PropTypes.object,
  classe: PropTypes.object,
  session: PropTypes.object,
  inTab: PropTypes.bool,
};

export default Dashboard;
