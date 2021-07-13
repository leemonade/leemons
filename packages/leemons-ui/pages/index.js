import React from 'react';
import Head from 'next/head';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Head>
        <title>Leemons UI</title>
      </Head>

      <main className="flex-grow p-4" data-theme="light">
        <button className={'btn btn-primary'}>Hola Mundo</button>
      </main>
    </div>
  );
}
