import React from 'react';
import ClassTable from '../../src/components/ClassTable';
import Wrapper from '../../src/components/Wrapper';
import { Divider, Card } from '../../src/components/ui';

function DividerPage() {
  const data = {
    showType: true,
    components: [{ class: 'divider', desc: 'Divide elements on top of each other' }],
    utilities: [{ class: 'divider-vertical', desc: 'Divide elements next to each other' }],
  };

  return (
    <main>
      <h2 className="mt-2 mb-6 text-5xl font-bold">
        <span className="text-primary">Divider</span>
      </h2>
      <div className="flex-grow p-4">
        <div className="text-xl font-bold">Examples</div>

        <Wrapper title="divider">
          <div className="flex flex-col w-full">
            <Card className="h-20 bg-base-300 place-items-center place-content-center">
              content
            </Card>
            <Divider>OR</Divider>
            <Card className="h-20 bg-base-300 place-items-center place-content-center">
              content
            </Card>
          </div>
        </Wrapper>
        <Wrapper title="divider vertical">
          <div className="flex flex-row w-full">
            <Card className="flex-grow h-20 bg-base-300 place-items-center place-content-center">
              content
            </Card>
            <Divider vertical>OR</Divider>
            <Card className="flex-grow h-20 bg-base-300 place-items-center place-content-center">
              content
            </Card>
          </div>
        </Wrapper>
        <Wrapper title="divider with no text">
          <div className="flex flex-col w-full">
            <Card className="h-20 bg-base-300 place-items-center place-content-center">
              content
            </Card>
            <Divider />
            <Card className="h-20 bg-base-300 place-items-center place-content-center">
              content
            </Card>
          </div>
        </Wrapper>
        <Wrapper title="divider vertical with no text">
          <div className="flex flex-row w-full">
            <Card className="flex-grow h-20 bg-base-300 place-items-center place-content-center">
              content
            </Card>
            <Divider vertical />
            <Card className="flex-grow h-20 bg-base-300 place-items-center place-content-center">
              content
            </Card>
          </div>
        </Wrapper>

        <Divider className="my-6" />
        <ClassTable data={data} />
      </div>
    </main>
  );
}

export default DividerPage;
