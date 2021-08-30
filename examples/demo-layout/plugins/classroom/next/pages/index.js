import Link from 'next/link';

function Classroom(props) {
  return (
    <>
      <div>Estamos en la home del plugin CLASSROOM</div>
      <div className="mt-4">
        <Link href="/classroom/room">
          <a className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Ir a SALAS</a>
        </Link>
      </div>
    </>
  );
}

Classroom.layout = 'admin';

export default Classroom;
