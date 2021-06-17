import useTranslate from '@multilanguage/useTranslate';
import Link from 'next/link';

export default function Home() {
  const [translations, errors, loading] = useTranslate({
    keys: ['config.name', 'config.settings'],
    locale: 'es',
  });
  if (loading) {
    return <p>Loading...</p>;
  }
  if (errors) {
    console.error('errors', errors);
    return <p>Error ${errors.message}</p>;
  }

  console.log('translations', translations);
  return (
    <div className="min-h-screen min-w-full bg-gray-800 pl-3 overflow-auto text-white">
      <div className="-ml-1 mt-2 mb-5 flex space-x-1">
        <Link href="/multilanguage/locales">
          <a className="bg-indigo-600 p-2 px-3 rounded-md block text-white">Locales page</a>
        </Link>
        <Link href="/multilanguage/localizations">
          <a className="bg-indigo-600 p-2 px-3 rounded-md block text-white">Localizations page</a>
        </Link>
      </div>
      <p>Locale {'undefined'}</p>
      <p>config.name = {translations['config.name'] || 'undefined'}</p>
      <p>config.settings = {translations['config.settings'] || 'undefined'}</p>
    </div>
  );
}
