import Link from 'next/link';

export default function Locales() {
  return (
    <div className="min-h-screen min-w-full bg-gray-800 m-0 overflow-auto flex items-center">
      <div className="absolute left-2 top-2 flex space-x-1">
        <Link href="/multilanguage">
          <a className="bg-indigo-600 p-2 px-3 rounded-md block text-white">Main page</a>
        </Link>
        <Link href="/multilanguage/locales">
          <a className="bg-indigo-600 p-2 px-3 rounded-md block text-white">Locales page</a>
        </Link>
      </div>
    </div>
  );
}
