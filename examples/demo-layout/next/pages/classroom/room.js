import React from 'react';
import Link from 'next/link';

function Room(props) {
  const goToComponent = 'Hello';

  return (
    <>
      <div>Estamos en SALAS</div>
      <div className="mt-4">
        <Link href="/classroom">
          <a className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Volver a CLASSROOM</a>
        </Link>
      </div>
    </>
  );
}

Room.layout = 'admin';

export default Room;
