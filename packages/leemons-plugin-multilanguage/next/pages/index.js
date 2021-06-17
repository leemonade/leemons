import useTranslate from '@multilanguage/useTranslate';
import Link from 'next/link';
import WithPersistentState from 'src/HOC/withPersistentState';

function Home({ persistentState: [state] }) {
  const { locale } = state;

  const [translations, errors, loading] = useTranslate({
    keys: ['config.name', 'config.settings'],
    locale: locale?.code,
  });

  function printBody() {
    if (loading) {
      return <p>Loading...</p>;
    }
    if (errors) {
      return <p>An error ocurred while loading the translations: {errors.message}</p>;
    }
    return (
      <>
        <p>Locale {locale ? `${locale.name} (${locale.code})` : 'undefined'}</p>
        <p>config.name = {translations['config.name'] || 'undefined'}</p>
        <p>config.settings = {translations['config.settings'] || 'undefined'}</p>
      </>
    );
  }

  return (
    <div className="min-h-screen min-w-full bg-gray-800 px-3 overflow-auto text-white">
      <div className="-ml-1 mt-2 mb-5 flex space-x-1">
        <Link href="/multilanguage/locales">
          <a className="bg-indigo-600 p-2 px-3 rounded-md block text-white">Locales page</a>
        </Link>
        <Link href="/multilanguage/localizations">
          <a className="bg-indigo-600 p-2 px-3 rounded-md block text-white">Localizations page</a>
        </Link>
      </div>
      {printBody()}
    </div>
  );
}

export default WithPersistentState(Home, 'multilanguage', { locale: null }, {});
