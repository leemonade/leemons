import React from 'react';
import Link from 'next/link';

function Roles(props) {
  const goToComponent = 'Hello';

  return (
    <>
      <div>Estamos en ROLES</div>
      <div>
        <Link href="/users">
          <a>Volver a Usuarios</a>
        </Link>
      </div>
      <div>
        <Link href={`/users/dynamic/${goToComponent}`}>
          <a>Probar {goToComponent}</a>
        </Link>
      </div>
    </>
  );
}

Roles.layout = 'admin';

export default Roles;
