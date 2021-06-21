import Link from 'next/link';

export default () => {
  return (
    <>
      <div>Estamos en la home del plugin USERS</div>
      <div>
        <Link href="roles">
          <a>Ir a ROLES</a>
        </Link>
      </div>
    </>
  );
};
