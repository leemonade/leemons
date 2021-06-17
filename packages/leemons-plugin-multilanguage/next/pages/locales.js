import { useState } from 'react';
import LocalePicker from '@multilanguage/components/LocalePicker';
import LocaleCreator from '@multilanguage/components/LocaleCreator';
import { useGetLocales } from '@multilanguage/helpers/getLocales';
import Link from 'next/link';
import WithPersistentState from 'src/HOC/withPersistentState';

function Locales({ persistentState: [state, setState] }) {
  const [locales, setLocales] = useState([]);
  useGetLocales(setLocales);
  // eslint-disable-next-line no-use-before-define

  function addLocale(locale) {
    if (!locales.find((_locale) => _locale.code === locale.code)) {
      setLocales((_locales) => [..._locales, locale]);
    }
  }

  function setLocale(locale) {
    if (locale) {
      setState({ locale });
    }
  }

  return (
    <div className="min-h-screen min-w-full bg-gray-800 m-0 overflow-auto flex items-center">
      <div className="absolute left-2 top-2 flex space-x-1">
        <Link href="/multilanguage">
          <a className="bg-indigo-600 p-2 px-3 rounded-md block text-white">Main page</a>
        </Link>
        <Link href="/multilanguage/localizations">
          <a className="bg-indigo-600 p-2 px-3 rounded-md block text-white">Localizations page</a>
        </Link>
      </div>
      <div className="container max-w-xs mx-auto p-3 flex flex-col text-gray-200">
        <h1 className="mt-3 mb-6 text-center text-3xl ">Locales</h1>
        {/* Add your locales */}
        <div className="mb-6">
          <h1 className="text-center text-xl mb-2">Add your own locales</h1>
          <LocaleCreator addLocale={addLocale} />
        </div>
        {/* Pick your locales */}
        <div>
          <h1 className="text-center text-xl mb-2">Pick your locales</h1>
          <LocalePicker locales={locales} setLocale={setLocale} selected={state.locale} />
        </div>
      </div>
    </div>
  );
}

export default WithPersistentState(Locales, 'multilanguage', { locale: null }, {});
