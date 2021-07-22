import constants from '@users/constants';
import { logoutSession, useSession } from '@users/session';
import {
  goListProfilesPage,
  goListUsersPage,
  goLoginPage,
  goSelectProfilePage,
} from '@users/navigate';
import { withLayout } from '@layout/hoc';

function UserTest() {
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
        className="absolute right-20 top-2 px-2 border border-gray-500 rounded"
        onClick={goSelectProfilePage}
      >
        Cambiar perfil
      </button>
      <button
        className="absolute right-2 top-2 px-2 border border-gray-500 rounded"
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
}

export default withLayout(UserTest);

/*
export async function getServerSideProps(context) {
  return {
    props: {
      session: await getSession(context),
    },
  };
}

 */
