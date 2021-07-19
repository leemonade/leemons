import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/outline';
import Wrapper from '../src/components/Wrapper';

export default function ConfigPage() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Head>
        <title>Leemons UI</title>
      </Head>

      <main>
        <h2 className="mt-6 text-5xl font-bold">
          <span className="text-primary">Config</span>
        </h2>
        <Wrapper nocode>
          <p className="mb-4">
            LeemonsUI can be configured from your{' '}
            <span className="badge badge-outline">tailwind.config.js</span> file
          </p>
          <div className="w-full max-w-4xl my-2">
            <div className="shadow-lg mockup-code">
              <pre>
                <code>
                  {`module.exports = {
    `}
                  <span className="text-neutral-content text-opacity-50">
                    {'// add LeemonsUI plugin'}
                  </span>
                  {`
    plugins: [
      require('leemons-ui/dist/theme'),
    ],

    `}
                  <span className="text-neutral-content text-opacity-50">
                    {'// config (optional)'}
                  </span>
                  {`
    leemons: {
      styled: true,
      themes: true,
      base: true,
      utils: true,
      logs: true,
      rtl: false,
    },
  }`}
                </code>
              </pre>
            </div>
          </div>
          <h2 className="my-6 text-3xl font-bold">
            <span className="text-primary">Config values explained:</span>
          </h2>
          <p className="my-4">You can add a `leemons` object and change default config:</p>
          <h2 className="mt-6 text-2xl font-bold">
            <span>styled</span>
          </h2>
          <p className="badge badge-outline">default: true</p>
          <p className="my-4">
            If it&apos;s true, components will have colors and style so you won&apos;t need to
            design anything.
            <br />
            If it&apos;s false, components will have no color and no visual style so you can design
            your own style on a basic skeleton.
          </p>
          <h2 className="mt-6 text-2xl font-bold">
            <span>themes</span>
          </h2>
          <p className="badge badge-outline">default: true</p>
          <p className="my-4">
            If it&apos;s true, all themes will be included.
            <br />
            If it&apos;s false, only light theme will be available.
            <br />
            themes config can be an array of theme names:
          </p>
          <div className="w-full max-w-4xl my-2">
            <div className="shadow-lg mockup-code">
              <pre>
                <code>
                  {`leemons: {
  themes: [
    'light', `}
                  <span className="text-neutral-content text-opacity-50">
                    {'// first one will be the default theme'}
                  </span>
                  {`
    'dark'
  ],
},`}
                </code>
              </pre>
            </div>
          </div>
          <br />
          The first item of array will be the default theme.
          <br />
          if no theme is chosen on{' '}
          <span className="badge badge-outline">{'<html data-theme="THEME_NAME">'}</span> and{' '}
          <span className="badge badge-outline">dark</span> theme is in themes config, default theme
          and dark theme will be activated based on operating system preferences.
          <br />
          <Link href="/default-themes">
            <a className="link">read more about default themes</a>
          </Link>
          <br />
          You can add your custom themes in config:
          <div className="w-full max-w-4xl my-2">
            <div className="shadow-lg mockup-code">
              <pre>
                <code>
                  {`leemons: {
      themes: [`}
                  <div className="bg-secondary-focus">
                    {`
      {
        'mytheme': { `}
                    <span className="text-neutral-content text-opacity-50">
                      {'// custom theme'}
                    </span>
                    {`
          'primary' : '#ea5234',
          'primary-focus' : '#d43616',
          'primary-content' : '#ffffff',
          `}
                    <span className="text-neutral-content text-opacity-50">
                      {'// other colors'}
                    </span>
                    {`
        },
        'myothertheme': { `}
                    <span className="text-neutral-content text-opacity-50">
                      {'// custom theme'}
                    </span>
                    {`
          'primary' : '#007ebd',
          'primary-focus' : '#005c8a',
          'primary-content' : '#ffffff',
          `}
                    <span className="text-neutral-content text-opacity-50">
                      {'// other colors'}
                    </span>
                    {`
        },
      },
        `}
                  </div>
                  {`      'dark' `}
                  <span className="text-neutral-content text-opacity-50">
                    {'// and some pre-defined theme'}
                  </span>
                  {`
    ],
  },`}
                </code>
              </pre>
            </div>
          </div>
          <h2 className="mt-6 text-2xl font-bold">
            <span>base</span>
          </h2>
          <p className="badge badge-outline">default: true</p>
          <p className="my-4">
            If it&apos;s true,{' '}
            <a
              target="_blank"
              className="link"
              href="https://github.com/leemonade/leemons/tree/feature/ui/packages/leemons-ui/src/theme/base"
              rel="noreferrer"
            >
              a few base styles
            </a>{' '}
            will be added
          </p>
          <h2 className="mt-6 text-2xl font-bold">
            <span>utils</span>
          </h2>
          <p className="badge badge-outline">default: true</p>
          <p className="my-4">
            If it&apos;s true,{' '}
            <a
              target="_blank"
              className="link"
              href="https://github.com/leemonade/leemons/tree/feature/ui/packages/leemons-ui/src/theme/utilities"
              rel="noreferrer"
            >
              a few utility classes
            </a>{' '}
            will be added
          </p>
          <h2 className="mt-6 text-2xl font-bold">
            <span>logs</span>
          </h2>
          <p className="badge badge-outline">default: true</p>
          <p className="my-4">
            If it&apos;s true, LeemonsUI shows logs in terminal while CSS is building
          </p>
          <h2 className="mt-6 text-2xl font-bold">
            <span>rtl</span>
          </h2>
          <p className="badge badge-outline">default: false</p>
          <p className="my-4">
            If it&apos;s true, your theme will be right-to-left. You need to add{' '}
            <span className="badge badge-outline">{'dir="rtl"'}</span> to your body tag. If
            you&apos;re using LeemonsUI with RTL option, I also suggest using{' '}
            <a
              className="link"
              href="https://github.com/cvrajeesh/tailwindcss-flip"
              target="_blank"
              rel="noreferrer"
            >
              tailwindcss-flip
            </a>{' '}
            plugin. It flips all your tailwind utilities automatically.
          </p>
          <div className="flex justify-end max-w-4xl pt-10 mt-20 border-t-2 border-base-200">
            <Link href="/default-themes">
              <a className="text-xs btn-lg btn lg:text-lg">
                Next: Themes
                <ChevronRightIcon className="inline-block w-6 h-6 ml-2 stroke-current" />
              </a>
            </Link>
          </div>
        </Wrapper>
      </main>
    </div>
  );
}
