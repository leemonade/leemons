import React from 'react';
import Head from 'next/head';

export default function StyleGuide() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Head>
        <title>Leemons UI</title>
      </Head>

      <main className="prose flex-grow p-4">
        <div>
          <div className="items-end justify-start h-96 hero bg-primary rounded-box">
            <div className="hero-content">
              <div className="py-6 hero-text">
                <div className="py-2 font-bold text-9xl text-primary-content">Aa</div>
                <div className="py-2 text-5xl font-bold text-primary-content">Style Guide Demo</div>
                <div className="py-2 text-primary-content">Omnis quo eveniet veniam quis odit.</div>
              </div>
            </div>
          </div>

          <div className="pt-32 pb-12">
            <div className="inline-block text-5xl font-bold border-b-8 lg:text-7xl text-base-content border-primary">
              Headings
            </div>
          </div>

          <div className="flex flex-col lg:space-x-6 lg:flex-row">
            <div className="space-y-2 text-base-content">
              <h1>Heading h1</h1>
              <h2>Heading h2</h2>
              <h3>Heading h3</h3>
              <p>Paragraph</p>
            </div>
          </div>

          <div className="pt-32 pb-12">
            <div className="inline-block text-5xl font-bold border-b-8 lg:text-7xl text-base-content border-primary">
              Typography
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2 font-bold text-base-content">
              <div className="text-9xl">9xl</div>
              <div className="text-8xl">8xl</div>
              <div className="text-7xl">7xl</div>
              <div className="text-6xl">6xl</div>
              <div className="text-5xl">5xl</div>
              <div className="text-4xl">4xl</div>
              <div className="text-3xl">3xl</div>
              <div className="text-2xl">2xl</div>
              <div className="text-xl">xl</div>
              <div className="text-lg">lg</div>
              <div className="text-base">base</div>
              <div className="text-sm">sm</div>
              <div className="text-xs">xs</div>
            </div>
            <div className="space-y-2 text-base-content">
              <div className="text-9xl">9xl</div>
              <div className="text-8xl">8xl</div>
              <div className="text-7xl">7xl</div>
              <div className="text-6xl">6xl</div>
              <div className="text-5xl">5xl</div>
              <div className="text-4xl">4xl</div>
              <div className="text-3xl">3xl</div>
              <div className="text-2xl">2xl</div>
              <div className="text-xl">xl</div>
              <div className="text-lg">lg</div>
              <div className="text-base">base</div>
              <div className="text-sm">sm</div>
              <div className="text-xs">xs</div>
            </div>
          </div>

          <div className="pt-32 pb-12">
            <div className="inline-block text-5xl font-bold border-b-8 lg:text-7xl text-base-content border-primary">
              Brand Colors
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-10 text-xs font-semibold capitalize">
            <div>
              <div className="w-20 h-20 shadow-lg w-fill lg:w-32 lg:h-32 rounded-box bg-primary"></div>
              <div className="py-4">primary</div>
            </div>
            <div>
              <div className="w-20 h-20 shadow-lg w-fill lg:w-32 lg:h-32 rounded-box bg-primary-focus"></div>
              <div className="py-4">primary focus</div>
            </div>
            <div>
              <div className="w-20 h-20 shadow-lg w-fill lg:w-32 lg:h-32 rounded-box bg-primary-content"></div>
              <div className="py-4">primary content</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-10 text-xs font-semibold capitalize">
            <div>
              <div className="w-20 h-20 shadow-lg w-fill lg:w-32 lg:h-32 rounded-box bg-secondary"></div>
              <div className="py-4">secondary</div>
            </div>
            <div>
              <div className="w-20 h-20 shadow-lg w-fill lg:w-32 lg:h-32 rounded-box bg-secondary-focus"></div>
              <div className="py-4">secondary focus</div>
            </div>
            <div>
              <div className="w-20 h-20 shadow-lg w-fill lg:w-32 lg:h-32 rounded-box bg-secondary-content"></div>
              <div className="py-4">secondary content</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-10 text-xs font-semibold capitalize">
            <div>
              <div className="w-20 h-20 shadow-lg w-fill lg:w-32 lg:h-32 rounded-box bg-accent"></div>
              <div className="py-4">accent</div>
            </div>
            <div>
              <div className="w-20 h-20 shadow-lg w-fill lg:w-32 lg:h-32 rounded-box bg-accent-focus"></div>
              <div className="py-4">accent focus</div>
            </div>
            <div>
              <div className="w-20 h-20 shadow-lg w-fill lg:w-32 lg:h-32 rounded-box bg-accent-content"></div>
              <div className="py-4">accent content</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-10 text-xs font-semibold capitalize">
            <div>
              <div className="w-20 h-20 shadow-lg w-fill lg:w-32 lg:h-32 rounded-box bg-neutral"></div>
              <div className="py-4">neutral</div>
            </div>
            <div>
              <div className="w-20 h-20 shadow-lg w-fill lg:w-32 lg:h-32 rounded-box bg-neutral-focus"></div>
              <div className="py-4">neutral focus</div>
            </div>
            <div>
              <div className="w-20 h-20 shadow-lg w-fill lg:w-32 lg:h-32 rounded-box bg-neutral-content"></div>
              <div className="py-4">neutral content</div>
            </div>
          </div>

          <div className="pt-32 pb-12">
            <div className="inline-block text-5xl font-bold border-b-8 lg:text-7xl text-base-content border-primary">
              Base Colors
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-10 text-xs font-semibold capitalize lg:grid-cols-5">
            <div>
              <div className="w-20 h-20 shadow-lg rounded-box bg-base-100"></div>
              <div className="py-4">100</div>
            </div>
            <div>
              <div className="w-20 h-20 shadow-lg rounded-box bg-base-200"></div>
              <div className="py-4">200</div>
            </div>
            <div>
              <div className="w-20 h-20 shadow-lg rounded-box bg-base-300"></div>
              <div className="py-4">300</div>
            </div>
            <div>
              <div className="w-20 h-20 shadow-lg rounded-box bg-base-content"></div>
              <div className="py-4">content</div>
            </div>
          </div>

          <div className="pt-32 pb-12">
            <div className="inline-block text-5xl font-bold border-b-8 lg:text-7xl text-base-content border-primary">
              State Colors
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-10 text-xs font-semibold capitalize lg:grid-cols-5">
            <div>
              <div className="w-20 h-20 shadow-lg rounded-box bg-info"></div>
              <div className="py-4">info</div>
            </div>
            <div>
              <div className="w-20 h-20 shadow-lg rounded-box bg-success"></div>
              <div className="py-4">success</div>
            </div>
            <div>
              <div className="w-20 h-20 shadow-lg rounded-box bg-warning"></div>
              <div className="py-4">warning</div>
            </div>
            <div>
              <div className="w-20 h-20 shadow-lg rounded-box bg-error"></div>
              <div className="py-4">error</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
