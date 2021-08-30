import React from 'react';
import { XIcon } from '@heroicons/react/outline';
import { Logo, Card, Tooltip } from '../../src/components/ui';
import Wrapper from '../../src/components/Wrapper';

function LogoPage() {
  return (
    <main>
      <h2 className="mt-2 mb-6 text-5xl font-bold">
        <span className="text-primary">Logo</span>
      </h2>
      <div className="flex-grow p-4">
        <div className="text-xl font-bold">Examples</div>

        <Wrapper
          className="flex flex-wrap items-start md:space-x-2 space-x-0 space-y-2 md:space-y-0 flex-col md:flex-row"
          title="logo"
        >
          <Logo />
        </Wrapper>

        <Wrapper title="logo colors">
          <div className="flex space-x-4 mt-8">
            <Card className="text-center shadow-2xl">
              <Tooltip content={'color="positive"'} open placement="top" color="primary">
                <div className="card-body">
                  <Logo />
                </div>
              </Tooltip>
            </Card>
            <Card className="text-center shadow-2xl bg-secondary">
              <Tooltip content={'color="negative"'} open placement="top" color="primary">
                <div className="card-body">
                  <Logo color="negative" />
                </div>
              </Tooltip>
            </Card>
          </div>
        </Wrapper>

        <Wrapper title="logo isotype">
          <div className="flex space-x-4 mt-8">
            <Card className="text-center shadow-2xl">
              <div className="p-4">
                <Logo isotype />
              </div>
            </Card>

            <Card className="text-center shadow-2xl bg-secondary">
              <div className="p-4">
                <Logo isotype />
              </div>
            </Card>
          </div>
        </Wrapper>
      </div>
    </main>
  );
}

export default LogoPage;
