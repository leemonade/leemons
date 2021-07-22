import constants from '@users-groups-roles/constants';
import { logoutSession, useSession } from '@users-groups-roles/session';
import Router from 'next/router';

export default function UserTest() {
  const session = useSession({ redirectTo: constants.frontend.login });

  const logout = () => {
    logoutSession(constants.base);
  };

  return (
    <div>
      {session && (
        <div>
          <div>Nombre: {session.name}</div>
          <div>Email: {session.email}</div>
        </div>
      )}

      <div>Cutre menu</div>
      <div className="flex">
        <div onClick={() => Router.push(`/${constants.frontend.private.users.list}`)}>Usuarios</div>
        <div onClick={() => Router.push(`/${constants.frontend.private.profiles.list}`)}>
          Perfiles
        </div>
      </div>

      <button
        className="absolute right-2 top-2 px-2 border border-gray-500 rounded"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}

/*
export async function getServerSideProps(context) {
  return {
    props: {
      session: await getSession(context),
    },
  };
}

 */
