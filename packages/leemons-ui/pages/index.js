import React from 'react';
import Head from 'next/head';
import Header from '../partials/Header';
import Footer from '../partials/Footer';
import HeroHome from '../partials/HeroHome';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Head>
        <title>Leemons UI</title>
      </Head>

      <Header />

      <main className="flex-grow">
        <HeroHome />
      </main>

      <Footer />
    </div>
  );
}
