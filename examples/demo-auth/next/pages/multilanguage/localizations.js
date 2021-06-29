import Link from 'next/link';
import { useState } from 'react';
import { useGetLocales } from '@multilanguage/helpers/getLocales';
import WithPersistentState from 'src/HOC/withPersistentState';
import LocalePicker from '@multilanguage/components/LocalePicker';

function Localizations({ persistentState: [state] }) {
  const [locales, setLocales] = useState(null);
  useGetLocales(setLocales);
  return (
    <div className="min-h-screen min-w-full bg-gray-800 px-3 overflow-auto text-white">
      <div className="-ml-1 mt-2 mb-5 flex space-x-1">
        <Link href="/multilanguage">
          <a className="bg-indigo-600 p-2 px-3 rounded-md block text-white">Main page</a>
        </Link>
        <Link href="/multilanguage/locales">
          <a className="bg-indigo-600 p-2 px-3 rounded-md block text-white">Locales page</a>
        </Link>
      </div>

      <div className="container max-w-xs mx-auto p-3 flex flex-col text-gray-200 border border-black">
        <LocalePicker locales={locales} selected={state.locale} />
      </div>
    </div>
  );
}

export default WithPersistentState(Localizations, 'multilanguage', { locale: null }, {});
