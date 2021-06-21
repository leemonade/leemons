import React from 'react';
import Link from 'next/link';
import { withLayout } from '@layout/hoc';

function Roles(props) {
  const goToComponent = 'Hello';

  return (
    <>
      <div>Estamos en ROLES</div>
      <div>
        <Link href="/users">
          <a className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-md shadow-indigo-600 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Volver a Usuarios</a>
        </Link>
      </div>
      <div className="mt-2">
        <Link href={`/users/dynamic/${goToComponent}`}>
          <a className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Probar {goToComponent}</a>
        </Link>
      </div>
    </>
  );
}

export default withLayout(Roles);
