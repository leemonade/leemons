import React from 'react';
import { XIcon } from '@heroicons/react/outline';
import { Hero, Button, Divider } from '../../src/components/ui';
import ClassTable from '../../src/components/ClassTable';
import Wrapper from '../../src/components/Wrapper';

function BadgePage() {
  const data = {
    showType: true,
    components: [{ class: 'hero', desc: 'Container element' }],
    utilities: [],
  };

  return (
    <main>
      <h2 className="mt-2 mb-6 text-5xl font-bold">
        <span className="text-primary">Hero</span>
      </h2>
      <div className="flex-grow p-4">
        <div className="text-xl font-bold">Examples</div>

        <Wrapper title="Hero with max height">
          <Hero maxHeight={400} className="bg-base-200 rounded-md">
            <div className="h-full flex place-items-center place-content-center">Hola Mundo</div>
          </Hero>
        </Wrapper>

        <Divider className="my-6" />
        <ClassTable data={data} />
      </div>
    </main>
  );
}

export default BadgePage;
