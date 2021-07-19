import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ChevronRightIcon, ExclamationCircleIcon } from '@heroicons/react/outline';
import TabHandler from '../../src/components/TabHandler';
import { Alert } from '../../src/components/ui';
import Wrapper from '../../src/components/Wrapper';

export default function InstallCssPage() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Head>
        <title>Leemons UI</title>
      </Head>

      <main>
        <h2 className="mt-2 mb-6 text-5xl font-bold">
          <TabHandler />

          <span className="text-primary">Install and use as CSS file</span>
        </h2>

        <Wrapper nocode>
          <Alert className="mb-9 -mt-6 max-w-4xl">
            <div className="flex-1">
              <ExclamationCircleIcon className="w-6 h-6 mx-2" color="#ff5722" />
              <label>
                These file is large for production and you can&apos;t purge unused styles.
              </label>
            </div>
          </Alert>

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
            2. Include it in your <strong>{`<head>`}</strong> tag
          </p>
          <div className="w-full max-w-4xl my-2">
            <div className="text-sm shadow-lg mockup-code">
              <pre>
                <code>
                  <span className="text-neutral-content text-opacity-60">
                    {`<link rel="stylesheet" href="`}
                  </span>
                  {`node_modules/leemons-ui/dist/theme/leemons.css`}
                  <span className="text-neutral-content text-opacity-50">{`" type="text/css">`}</span>
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
