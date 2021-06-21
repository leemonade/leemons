import Link from 'next/link';
import { withLayout } from '@layout/hoc';

function Users(props) {
  return (
    <>
      <div>Estamos en la home del plugin USERS</div>
      <div>
        <Link href="/users/roles">
          <a>Ir a ROLES</a>
        </Link>
      </div>
    </>
  );
}

export default withLayout(Users, 'admin');
