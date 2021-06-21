import Link from 'next/link';

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

Users.layout = 'admin';

export default Users;
