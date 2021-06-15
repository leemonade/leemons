// eslint-disable-next-line import/no-extraneous-dependencies
import { useSession } from '@users-groups-roles/session';

export default function UserTest() {
  const session = useSession();
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
