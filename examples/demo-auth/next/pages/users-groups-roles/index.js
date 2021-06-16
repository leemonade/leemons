import constants from '@users-groups-roles/constants';
import { useSession } from '@users-groups-roles/session';

export default function UserTest() {
  const session = useSession({ redirectTo: constants.loginUrl });
  console.log(session);
  return <div>Hola index</div>;
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
