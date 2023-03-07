import { withLayout } from '@layout/hoc';
import { SocketIoService } from '@mqtt-socket-io/service';
import React, { useState } from 'react';

// Pagina a la que solo tendra acceso el super admin o los usuarios con el permiso de crear usuarios
function SocketTest() {
  const [state, setState] = useState(null);

  SocketIoService.useOn('gatitos', (event, args) => {
    console.log(event, args);
    setState(args);
  });

  const sendMessage = () => {
    leemons.api('users/test-mqtt-socket-io', {
      allAgents: true,
    });
  };

  return (
    <>
      Prueba socket.io
      <br />
      Pincha en el boton mandar mensaje y mira como recibes desde socket.io un mensaje, Miau!
      <br />
      <button onClick={sendMessage}>Mandar mensaje</button>
      <div>{JSON.stringify(state)}</div>
    </>
  );
}

export default withLayout(SocketTest);
