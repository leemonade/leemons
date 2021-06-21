export default function Hello(props) {
  const useTranslate = (key, lang) => {
    const texts = {
      'mi-plugin_miModulo_hola': {
        en: 'Hello',
        es: 'Hola',
      },
    };
    return texts[key][lang];
  };

  const texts = useTranslate(['mi-plugin_miModulo_hola'], 'es');

  return (
    <>
      <div>{texts['mi-plugin_miModulo_hola']}</div>
    </>
  );
}
