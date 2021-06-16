import useTranslate from '@multilanguage/useTranslate';

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
    <div>
      <p>config.name = {translations['config.name']}</p>
      <p>config.settings = {translations['config.settings']}</p>
    </div>
  );
}
