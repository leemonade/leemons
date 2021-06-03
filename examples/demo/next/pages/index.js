import React from 'react';
import Head from 'next/head';
import { SelectBox } from 'leemons-ui';

const people = [
  { label: 'Wade Cooper', value: 'Wade Cooper' },
  { label: 'Arlene Mccoy', value: 'Arlene Mccoy' },
  { label: 'Devon Webb', value: 'Devon Webb' },
  { label: 'Tom Cook', value: 'Tom Cook' },
  { label: 'Tanya Fox', value: 'Tanya Fox' },
  { label: 'Hellen Schmidt', value: 'Hellen Schmidt' },
];

function Home() {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Hola Index.js</h1>

        <SelectBox options={people} />
      </main>
    </div>
  );
}

export default Home;
