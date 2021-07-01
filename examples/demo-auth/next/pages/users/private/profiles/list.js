import constants from '@users/constants';
import { useEffect, useState } from 'react';
import { useSession } from '@users/session';
import Router from 'next/router';

export default function ListProfiles() {
  const [pagination, setPagination] = useState(null);
  useSession({ redirectTo: constants.frontend.login });

  async function listProfiles() {
    try {
      const response = await leemons.api(constants.backend.profiles.list, {
        method: 'POST',
        body: {
          page: 0,
          size: 10,
        },
      });
      console.log(response);
      setPagination(response.data);
    } catch (err) {
      console.log('petazo');
      console.error(err);
    }
  }

  useEffect(() => {
    listProfiles();
  }, []);

  return (
    <>
      <div>Perfiles:</div>
      <button onClick={() => Router.push(`/${constants.frontend.private.profiles.detail}`)}>
        Crear nuevo perfil
      </button>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Creado el</th>
          </tr>
        </thead>
        <tbody>
          {pagination
            ? pagination.items.map((item) => (
                <tr key={item.id}>
                  <td
                    onClick={() =>
                      Router.push(`/${constants.frontend.private.profiles.detail}/${item.uri}`)
                    }
                  >
                    {item.name}
                  </td>
                  <td>{item.created_at}</td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
    </>
  );
}
