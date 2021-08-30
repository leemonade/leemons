import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/outline';
import Wrapper from '../src/components/Wrapper';

export default function UsePage() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Head>
        <title>Leemons UI</title>
      </Head>

      <main>
        <h2 className="mt-6 text-5xl font-bold">
          <span className="text-primary">Add component classes </span>
          <span>to your HTML: </span>
        </h2>

        <Wrapper nocode>
          <p className="prose text-base-content">
            Once you{' '}
            <Link href="/install">
              <a>installed</a>
            </Link>{' '}
            LeemonsUI, you can use component classes like{' '}
            <span className="badge badge-outline">btn</span>,{' '}
            <span className="badge badge-outline">card</span>, etc...
          </p>

          <p className="my-4">So instead of making a button like this:</p>
          <div className="w-full max-w-4xl my-2">
            <div className="shadow-lg mockup-code">
              <pre>
                <code>
                  &#x3C;button class=&#x22;
                  <span className="text-warning">
                    inline-block px-4 py-3 text-sm font-semibold text-center text-white uppercase
                    transition duration-200 ease-in-out bg-indigo-500 rounded-md cursor-pointer
                    hover:bg-indigo-600
                  </span>
                  &#x22;&#x3E;Tailwind Button&#x3C;/button&#x3E;
                </code>
              </pre>
            </div>
          </div>

          <div className="w-full my-2">
            <button className="inline-block px-4 py-3 text-sm font-semibold text-center text-white uppercase transition duration-200 ease-in-out bg-indigo-500 rounded-md cursor-pointer hover:bg-indigo-600">
              Tailwind Button
            </button>
          </div>

          <p className="my-4">You just need this:</p>
          <div className="w-full max-w-4xl my-2">
            <div className="shadow-lg mockup-code">
              <pre>
                <code>
                  &#x3C;button class=&#x22;<span className="text-success">btn btn-primary</span>
                  &#x22;&#x3E;LeemonsUI Button&#x3C;/button&#x3E;
                </code>
              </pre>
            </div>
          </div>

          <p className="my-4">or in ReactJS:</p>
          <div className="w-full max-w-4xl my-2">
            <div className="shadow-lg mockup-code">
              <pre>
                <code>
                  <span className="text-warning">
                    {`import { `}
                    <span className="text-white">Button</span>
                    {` } from "lemons-ui";`}
                  </span>
                  {`
  `}
                  <span className="text-secondary-300">...</span>
                  {`
  <Button color="`}
                  <span className="text-success">primary</span>
                  {`">LeemonsUI Button</button>`}
                </code>
              </pre>
            </div>
          </div>

          <div className="w-full my-2">
            <button className="btn btn-primary">LeemonsUI Button</button>
          </div>

          <p className="max-w-4xl my-4">
            As you can see: cleaner code, better animations, better accessibility, and more
            importantly, easily themeable.
          </p>
        </Wrapper>

        <div className="flex justify-end max-w-4xl pt-10 mt-20 border-t-2 border-base-200">
          <Link href="/config">
            <a className="text-xs btn-lg btn lg:text-lg">
              Next: Config
              <ChevronRightIcon className="inline-block w-6 h-6 ml-2 stroke-current" />
            </a>
          </Link>
        </div>
      </main>
    </div>
  );
}
