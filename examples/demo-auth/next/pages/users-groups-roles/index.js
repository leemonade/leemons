import constants from '@users-groups-roles/constants';
import { logoutSession, useSession } from '@users-groups-roles/session';

export default function UserTest() {
  useSession({ redirectTo: constants.frontend.login });

  const logout = () => {
    logoutSession(constants.base);
  };

  return (
    <div>
      <button onClick={logout}>Logout</button>
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
