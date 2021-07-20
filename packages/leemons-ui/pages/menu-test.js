import React from 'react';
import Head from 'next/head';
import { ChevronRightIcon, TemplateIcon, AtSymbolIcon } from '@heroicons/react/outline';
import { Avatar, Button, Tooltip } from '../src/components/ui';

export default function LayoutPage() {
  return (
    <div>
      <Head>
        <title>Leemons UI</title>
      </Head>

      <div className="flex flex-row">
        <aside className="flex flex-col bg-secondary w-20 h-screen">
          <div className="flex place-content-center place-items-center h-16">
            <Avatar circle size={10}>
              <img src="http://daisyui.com/tailwind-css-component-profile-1@40w.png" />
            </Avatar>
          </div>
          <div className="flex flex-col flex-grow space-y-1 overflow-y-auto px-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((num) => (
              <div key={`b-${num}`}>
                <Tooltip content="Hola" position="right" color="primary" open>
                  <Button color="primary">{num}</Button>
                </Tooltip>
              </div>
            ))}
          </div>
          <div className="flex place-content-center place-items-center h-16">
            <Avatar circle size={10}>
              <img src="http://daisyui.com/tailwind-css-component-profile-1@40w.png" />
            </Avatar>
          </div>
        </aside>

        <main className="flex-grow block overflow-x-hidden bg-base-100 text-base-content drawer-content">
          <div className="p-4 lg:p-10">Aquí va el contenido de la izquierda</div>
        </main>
      </div>
    </div>
  );
}
