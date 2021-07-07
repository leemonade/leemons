import constants from '@users/constants';
import { logoutSession, useSession } from '@users/session';
import { goListProfilesPage, goListUsersPage, goLoginPage } from '@users/navigate';

export default function UserTest() {
  const session = useSession({ redirectTo: goLoginPage });

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
        <div onClick={goListUsersPage}>Usuarios</div>
        <div onClick={goListProfilesPage}>Perfiles</div>
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
