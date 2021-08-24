import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';
import { withLayout } from '@layout/hoc';

function Test() {
  const session = useSession({ redirectTo: goLoginPage });

  return (
    <div>
      {session && (
        <div>
          <div>Nombre: {session.name}</div>
          <div>Email: {session.email}</div>
        </div>
      )}
    </div>
  );
}

export default withLayout(Test);

/*
export async function getServerSideProps(context) {
  return {
    props: {
      session: await getSession(context),
    },
  };
}
 */
