import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ChevronRightIcon, InformationCircleIcon } from '@heroicons/react/outline';
import Wrapper from '../src/components/Wrapper';

export default function DefaultThemePage() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Head>
        <title>Leemons UI</title>
      </Head>

      <main>
        <h2 className="mt-6 text-5xl font-bold">
          <span className="text-primary">Use Themes</span>
        </h2>

        <Wrapper nocode>
          <h2 className="mb-6 text-3xl font-bold">
            <span>How to use a theme?</span>
          </h2>

          <p className="mb-4 text-lg">
            Add <span className="badge badge-outline">{`data-theme="THEME_NAME"`}</span> to{' '}
            <strong>{`<html>`}</strong> tag.
          </p>
          <p className="my-4 text-lg prose">
            I suggest using{' '}
            <a href="https://github.com/saadeghi/theme-change" target="_blank" rel="noreferrer">
              theme-change
            </a>
            , so you can switch themes and save selected theme in local storage.
          </p>

          <div className="w-full max-w-4xl my-2">
            <div className="shadow-lg mockup-code">
              <pre>
                <code>
                  <span className="text-neutral-content text-opacity-50">{'<html '}</span>
                  {'data-theme="light"'}
                  <span className="text-neutral-content text-opacity-50">{'>'}</span>
                </code>
              </pre>
            </div>
          </div>

          <p className="my-4 text-lg font-bold">List of themes:</p>
          <div className="w-full max-w-lg my-2">
            <div className="text-sm shadow-lg mockup-code">
              <pre>
                <code> light (default)</code>
                <code>dark</code>
              </pre>
            </div>
          </div>

          <p className="my-4 text-lg">
            The default theme is <span className="badge badge-outline">light</span> but you can
            change it from{' '}
            <Link href="/config">
              <a className="link">config</a>
            </Link>
            .
          </p>
          <p className="my-4 text-lg">
            To make your own theme, please see
            <Link href="/add-themes">
              <a className="link">add themes</a>
            </Link>
            page
          </p>

          <h2 className="mb-6 mt-20 text-3xl font-bold">
            <span>
              If you&apos;re not using Tailwind JIT
              <a
                target="_blank"
                className="text-info"
                href="https://tailwindcss.com/docs/just-in-time-mode"
                rel="noreferrer"
              >
                <InformationCircleIcon className="inline w-5 h-5 stroke-current" />
              </a>
            </span>
          </h2>
          <p className="my-4 text-lg">
            You need to safelist <span className="badge badge-outline">data-theme</span> attribute
            so PurgeCSS doesn&apos;t purge it
          </p>

          <div className="w-full max-w-4xl my-2">
            <div className="shadow-lg mockup-code">
              <pre>
                <code>
                  <span className="text-neutral-content text-opacity-40">{`module.exports = {`}</span>
                  {`
    purge: {
      content: ['yourfiles/**/*.html'],
      options: {
        safelist: [
          `}
                  <span className="badge badge-primary">/data-theme$/,</span>
                  {`
        ]
      },
    },
  `}
                  <span className="text-neutral-content text-opacity-40">{'}'}</span>
                </code>
              </pre>
            </div>
          </div>

          <h2 className="mb-6 mt-20 text-3xl font-bold">
            <span>How to disable themes</span>
          </h2>

          <p className="my-4 text-lg">
            If you don&apos;t want to include themes, you need to disable{' '}
            <span className="badge badge-outline">themes</span> config.
          </p>

          <div className="w-full max-w-4xl my-2">
            <div className="shadow-lg mockup-code">
              <pre>
                <code>
                  <span className="text-neutral-content text-opacity-40">{`module.exports = {`}</span>
                  {`
    leemons: {
      styled: true,
      `}
                  <span className="badge badge-primary">themes: false,</span>
                  {`
      rtl: false,
    },
  `}
                  <span className="text-neutral-content text-opacity-40">{'}'}</span>
                </code>
              </pre>
            </div>
          </div>

          <h2 className="mb-6 mt-20 text-3xl font-bold">
            <span>How to use a theme only for a section of page?</span>
          </h2>

          <p className="my-4 text-lg prose">
            Add <span className="badge badge-outline">{`data-theme="THEME_NAME"`}</span> to any
            element and everything inside will have your theme. You can nest themes and there is no
            limit!
          </p>

          <p className="my-4 text-lg prose">
            You can force a section of your HTML to only use a specific theme.
          </p>

          <div className="w-full max-w-4xl my-2">
            <div className="shadow-lg mockup-code">
              <pre>
                <code>
                  {'<html '}
                  <span className="badge badge-primary">{'data-theme="dark"'}</span>
                  {`>
    <div `}
                  <span className="badge badge-primary">{'data-theme="light"'}</span>
                  {`>
      This div will always use light theme
      <span `}
                  <span className="badge badge-primary">{'data-theme="dark"'}</span>
                  {`>
        This span will always use dark theme!
      </span>
    </div>
  </html>`}
                </code>
              </pre>
            </div>
          </div>

          <div className="flex justify-end max-w-4xl pt-10 mt-20 border-t-2 border-base-200">
            <Link href="/colors">
              <a className="text-xs btn-lg btn lg:text-lg">
                Next: Colors
                <ChevronRightIcon className="inline-block w-6 h-6 ml-2 stroke-current" />
              </a>
            </Link>
          </div>
        </Wrapper>
      </main>
    </div>
  );
}
