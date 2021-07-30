/*import { useEffect, useState } from 'react';
import { useSession } from '@users/session';
import { listProfilesRequest } from '@users/request';
import { goDetailProfilePage, goLoginPage } from '@users/navigate';

 */

export default function ListProfiles() {
  return null;
  /*
  const [pagination, setPagination] = useState(null);
  useSession({ redirectTo: goLoginPage });

  async function listRoles() {
    try {
      const { data } = await listProfilesRequest({
        page: 0,
        size: 10,
      });
      setPagination(data);
    } catch (err) {
      console.log('petazo');
      console.error(err);
    }
  }

  useEffect(() => {
    listRoles();
  }, []);

  return (
    <>
      <div>Perfiles:</div>
      <button onClick={goDetailProfilePage}>Crear nuevo perfil</button>
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
                  <td onClick={() => goDetailProfilePage(item.uri)}>{item.name}</td>
                  <td>{item.created_at}</td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
    </>
  );
   */
}
