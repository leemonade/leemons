import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/outline';
import TabHandler from '../../src/components/TabHandler';
import Wrapper from '../../src/components/Wrapper';

export default function InstallPage() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Head>
        <title>Leemons UI</title>
      </Head>

      <main>
        <h2 className="mt-6 text-5xl font-bold">
          <TabHandler />

          <span className="text-primary">Install as Tailwind CSS plugin</span>
        </h2>

        <Wrapper nocode>
          <p className="prose text-base-content opacity-60">
            You need{' '}
            <a target="_blank" href="https://nodejs.org/en/download/" rel="noreferrer">
              Node.js
            </a>{' '}
            and{' '}
            <a target="_blank" href="https://tailwindcss.com/docs/installation" rel="noreferrer">
              Tailwind CSS
            </a>{' '}
            installed.
          </p>

          <p className="my-4">1. Install LeemonsUI:</p>
          <div className="w-full max-w-xl my-2">
            <div className="shadow-lg mockup-code">
              <pre data-prefix="$">
                <code>npm i leemons-ui --save</code>
              </pre>
            </div>
          </div>

          <p className="my-4">
            2. Then add LeemonsUI to your{' '}
            <span className="badge badge-outline">tailwind.config.js</span>
          </p>
          <div className="w-full max-w-xl my-2">
            <div className="text-sm shadow-lg mockup-code">
              <pre>
                <code>
                  {`module.exports = {
      plugins: [
        `}
                  <span className="badge badge-primary">{`require('leemons-ui/dist/theme'),`}</span>
                  {`
      ],
    }`}
                </code>
              </pre>
            </div>
          </div>

          <p className="my-4">3. Finally add required fonts:</p>
          <p className="prose text-base-content opacity-60">
            As <strong>@import</strong> in your CSS file
          </p>
          <div className="w-full my-2">
            <div className="text-sm shadow-lg mockup-code">
              <pre>
                <code>
                  <span className="text-neutral-content text-opacity-60">{`@import url("`}</span>
                  {`https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Lexend:wght@300;400;500;600&display=swap`}
                  <span className="text-neutral-content text-opacity-60">{`");`}</span>
                </code>
              </pre>
            </div>
          </div>
          <p className="prose text-base-content opacity-60">
            Or included in your <strong>{`<head>`}</strong> tag
          </p>
          <div className="w-full my-2">
            <div className="text-sm shadow-lg mockup-code">
              <pre>
                <code>
                  <span className="text-neutral-content text-opacity-60">
                    {`<link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="`}
                  </span>
                  {`https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Lexend:wght@300;400;500;600&display=swap`}
                  <span className="text-neutral-content text-opacity-50">{`" rel="stylesheet">`}</span>
                </code>
              </pre>
            </div>
          </div>

          <div className="flex justify-end max-w-4xl pt-10 mt-20 border-t-2 border-base-200">
            <Link href="/use">
              <a className="text-xs btn-lg btn lg:text-lg">
                Next: How to use
                <ChevronRightIcon className="inline-block w-6 h-6 ml-2 stroke-current" />
              </a>
            </Link>
          </div>
        </Wrapper>
      </main>
    </div>
  );
}
