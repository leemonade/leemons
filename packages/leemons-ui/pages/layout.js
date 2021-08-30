import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ChevronRightIcon, TemplateIcon, AtSymbolIcon } from '@heroicons/react/outline';
import Wrapper from '../src/components/Wrapper';

export default function LayoutPage() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Head>
        <title>Leemons UI</title>
      </Head>

      <main>
        <div className="tabs mb-10">
          <Link href="/layout">
            <a className="tab tab-lifted tab-lg tab-active">
              <TemplateIcon className="inline-block lg:w-6 w-4 h-4 lg:h-6 mr-2 stroke-current" />
              Layout
            </a>
          </Link>
          <Link href="/typography">
            <a className="tab tab-lifted tab-lg">
              <AtSymbolIcon className="inline-block lg:w-6 w-4 h-4 lg:h-6 mr-2 stroke-current" />
              Typography
            </a>
          </Link>
          <span className="tab tab-lifted tab-lg flex-grow cursor-default hidden sm:block"></span>
        </div>

        <h2 className="mt-6 text-5xl font-bold">
          <span className="text-primary">Layout</span>
        </h2>

        <Wrapper nocode className="prose text-base-content">
          <p>
            Layout, sizing, grids, spacing, etc... all will be handled by Tailwind CSS&apos;s
            utility classes
          </p>
          <p>Read more about:</p>
          <ul>
            <li>
              <a target="_blank" href="https://tailwindcss.com/docs/container" rel="noreferrer">
                Layout
              </a>
            </li>
            <li>
              <a target="_blank" href="https://tailwindcss.com/docs/width" rel="noreferrer">
                Sizing
              </a>
            </li>
            <li>
              <a target="_blank" href="https://tailwindcss.com/docs/flex" rel="noreferrer">
                Flexbox
              </a>
            </li>
            <li>
              <a
                target="_blank"
                href="https://tailwindcss.com/docs/grid-template-columns"
                rel="noreferrer"
              >
                Grid
              </a>
            </li>
            <li>
              <a
                target="_blank"
                href="https://tailwindcss.com/docs/justify-content"
                rel="noreferrer"
              >
                Box alignment
              </a>
            </li>
            <li>
              <a target="_blank" href="https://tailwindcss.com/docs/padding" rel="noreferrer">
                Spacing
              </a>
            </li>
          </ul>
        </Wrapper>

        <div className="flex justify-end max-w-4xl pt-10 mt-20 border-t-2 border-base-200">
          <Link href="/typography">
            <a className="text-xs btn-lg btn lg:text-lg">
              Next: typography
              <ChevronRightIcon className="inline-block w-6 h-6 ml-2 stroke-current" />
            </a>
          </Link>
        </div>
      </main>
    </div>
  );
}
