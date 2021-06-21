import React, { useEffect, useState } from 'react';

const getTranslations = async (keys, lang) => {
  // Realmente esto devuelve todas las traducciones para las KEYS y el LANG dados
  // Sin embargo, para efectos del ejemplo, lo que devuelve es un listado de libros
  const texts = await fetch(
    'https://www.etnassoft.com/api/v1/get/?keyword=javascript&publisher_date=2011'
  ).then((res) => res.json());
  return texts;
};

function Hello({ children, ...props }) {
  return (
    <>
      <div>Hola Mundo:</div>
      <div>{children}</div>
    </>
  );
}

export default function Home({ texts, ...props }) {
  const [translations, setTranslations] = useState(texts);

  useEffect(() => {
    let isSubscribed = true;

    if (!texts) {
      (async () => {
        const labels = await getTranslations();
        texts = [];
        labels.forEach((data) => texts.push(data.title));

        if (isSubscribed) {
          setTranslations(texts);
        }
      })();
    }

    return () => (isSubscribed = false);
  }, []);

  return <>{translations && <Hello>{translations[0]}</Hello>}</>;
}

export async function getServerSideProps(...args) {
  const labels = await getTranslations();
  const texts = [];
  labels.forEach((data) => texts.push(data.title));

  return { props: { texts } };
}
