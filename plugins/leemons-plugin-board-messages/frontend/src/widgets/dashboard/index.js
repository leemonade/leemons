import { BannerMessage, ModalMessage } from '@board-messages/components';
import { addViewRequest, getActiveRequest } from '@board-messages/request';
import { useLayout } from '@layout/context';
import { getCentersWithToken } from '@users/session';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

function Dashboard({ program }) {
  const { openModal, closeModal } = useLayout();
  const [activeMessage, setActiveMessage] = useState(null);

  async function load() {
    const { message } = await getActiveRequest({
      center: getCentersWithToken()[0].id,
      program: program.id,
      zone: 'dashboard',
    });
    if (message) {
      addViewRequest(message.id);
    }
    setActiveMessage(message);
  }

  async function loadModal() {
    const { message } = await getActiveRequest({
      center: getCentersWithToken()[0].id,
      program: program.id,
      zone: 'modal',
    });
    if (message) {
      const boardMessagesModalId = window.sessionStorage.getItem('boardMessagesModalId');
      if (boardMessagesModalId !== message.id) {
        addViewRequest(message.id);
        window.sessionStorage.setItem('boardMessagesModalId', message.id);
        const id = openModal({
          children: <ModalMessage message={message} onClose={() => closeModal(id)} />,
          size: 600,
          trapFocus: false,
        });
      }
    }
  }

  React.useEffect(() => {
    if (program) {
      load();
      loadModal();
    }
  }, [program]);

  if (!activeMessage) return null;

  return <BannerMessage message={activeMessage} />;
}

Dashboard.propTypes = {
  program: PropTypes.object,
  classe: PropTypes.object,
  session: PropTypes.object,
  inTab: PropTypes.bool,
};

export default Dashboard;
