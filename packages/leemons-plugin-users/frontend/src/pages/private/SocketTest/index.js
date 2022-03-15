import React, { useState } from 'react';
import { withLayout } from '@layout/hoc';
import { PageContainer, PageHeader } from 'leemons-ui';
import { SocketIoService } from '@socket-io/service';

// Pagina a la que solo tendra acceso el super admin o los usuarios con el permiso de crear usuarios
function SocketTest() {
  const [state, setState] = useState(null);

  SocketIoService.useOn('gatitos', (event, args) => {
    console.log(event, args);
    setState(args);
  });

  const sendMessage = () => {
    leemons.api('users/test-socket-io', {
      allAgents: true,
    });
  };

  return (
    <>
      <PageHeader
        title={'Prueba socket.io'}
        description={
          'Pincha en el boton mandar mensaje y mira como recibes desde socket.io un mensaje, Miau!'
        }
      />
      <PageContainer>
        <button onClick={sendMessage}>Mandar mensaje</button>
        <div>{JSON.stringify(state)}</div>
      </PageContainer>
    </>
  );
}

export default withLayout(SocketTest);
