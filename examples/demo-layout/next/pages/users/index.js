import Link from 'next/link';
import { withLayout } from '@layout/hoc';

function Users(props) {
  return (
    <>
      <div>Estamos en la home del plugin USERS</div>
      <div>
        <Link href="/users/roles">
          <a className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-md shadow-indigo-600 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Ir a ROLES
          </a>
        </Link>
      </div>
    </>
  );
}

export default withLayout(Users);
