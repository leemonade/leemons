import constants from '@users-groups-roles/constants';
import { useEffect, useState } from 'react';
import { useSession } from '@users-groups-roles/session';

export default function ListUsers() {
  const [pagination, setPagination] = useState(null);
  useSession({ redirectTo: constants.frontend.login });

  async function listUsers() {
    const response = await leemons.api(constants.backend.users.list, {
      method: 'POST',
      body: {
        page: 0,
        size: 10,
      },
    });
    setPagination(response.data);
  }

  useEffect(() => {
    listUsers();
  }, []);

  return (
    <>
      <div>Usuarios:</div>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Idioma</th>
            <th>Creado el</th>
          </tr>
        </thead>
        <tbody>
          {pagination
            ? pagination.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.language}</td>
                  <td>{item.created_at}</td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
    </>
  );
}
