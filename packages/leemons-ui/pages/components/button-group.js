import React from 'react';
import { DotsHorizontalIcon } from '@heroicons/react/outline';
import { Button, Divider } from '../../src/components/ui';
import ClassTable from '../../src/components/ClassTable';
import Wrapper from '../../src/components/Wrapper';

function ButtonGroupPage() {
  const data = {
    showType: true,
    components: [{ class: 'btn-group', desc: 'Container for grouping multiple buttons' }],
  };

  return (
    <main>
      <h2 className="mt-2 mb-6 text-5xl font-bold">
        <span className="text-primary">Button Group</span>
      </h2>
      <div className="flex-grow p-4">
        <div className="text-xl font-bold">Examples</div>

        <Wrapper title="button group">
          <div className="flex items-start flex-col space-y-2">
            <div className="btn-group">
              <Button className="btn-lg btn-active" disabled>
                Large
              </Button>
              <Button className="btn-lg">Large</Button>
              <Button className="btn-lg">Large</Button>
              <Button className="btn-lg">
                <DotsHorizontalIcon className="inline-block w-4 stroke-current" />
              </Button>
            </div>
            <div className="btn-group">
              <Button className="btn-active">Normal</Button>
              <Button>Normal</Button>
              <Button>Normal</Button>
              <Button>
                <DotsHorizontalIcon className="inline-block w-4 stroke-current" />
              </Button>
            </div>
            <div className="btn-group">
              <Button className="btn-sm btn-active" disabled>
                Small
              </Button>
              <Button className="btn-sm">Small</Button>
              <Button className="btn-sm">Small</Button>
              <Button className="btn-sm">
                <DotsHorizontalIcon className="inline-block w-4 stroke-current" />
              </Button>
            </div>
            <div className="btn-group">
              <Button className="btn-xs btn-active" disabled>
                Tiny
              </Button>
              <Button className="btn-xs">Tiny</Button>
              <Button className="btn-xs">Tiny</Button>
              <Button className="btn-xs">
                <DotsHorizontalIcon className="inline-block w-4 stroke-current" />
              </Button>
            </div>
          </div>
        </Wrapper>

        <Wrapper title="button group outline">
          <div className="flex items-start flex-col space-y-2">
            <div className="btn-group">
              <Button outlined className="btn-lg btn-active" disabled>
                Large
              </Button>
              <Button outlined color="primary" className="btn-lg">
                Large
              </Button>
              <Button outlined color="primary" className="btn-lg">
                Large
              </Button>
              <Button outlined color="primary" className="btn-lg">
                <DotsHorizontalIcon className="inline-block w-4 stroke-current" />
              </Button>
            </div>
            <div className="btn-group">
              <Button outlined className="btn-active" disabled>
                Normal
              </Button>
              <Button outlined color="primary">
                Normal
              </Button>
              <Button outlined color="primary">
                Normal
              </Button>
              <Button outlined color="primary">
                <DotsHorizontalIcon className="inline-block w-4 stroke-current" />
              </Button>
            </div>
            <div className="btn-group">
              <Button outlined className="btn-sm btn-active" disabled>
                Small
              </Button>
              <Button outlined color="primary" className="btn-sm">
                Small
              </Button>
              <Button outlined color="primary" className="btn-sm">
                Small
              </Button>
              <Button outlined color="primary" className="btn-sm">
                <DotsHorizontalIcon className="inline-block w-4 stroke-current" />
              </Button>
            </div>
            <div className="btn-group">
              <Button outlined className="btn-xs btn-active" disabled>
                Tiny
              </Button>
              <Button outlined color="primary" className="btn-xs">
                Tiny
              </Button>
              <Button outlined color="primary" className="btn-xs">
                Tiny
              </Button>
              <Button outlined color="primary" className="btn-xs">
                <DotsHorizontalIcon className="inline-block w-4 stroke-current" />
              </Button>
            </div>
          </div>
        </Wrapper>

        <Wrapper
          className="flex items-start flex-col space-y-2"
          title="button group with radio buttons"
        >
          <div className="btn-group">
            <input className="btn" type="radio" name="options" id="option1" data-title="1" />
            <input className="btn" type="radio" name="options" id="option2" data-title="2" />
            <input className="btn" type="radio" name="options" id="option3" data-title="3" />
            <input className="btn" type="radio" name="options" id="option4" data-title="4" />
            <input className="btn" type="radio" name="options" id="option5" data-title="5" />
          </div>
        </Wrapper>

        <Divider className="my-6" />
        <ClassTable data={data} />
      </div>
    </main>
  );
}

export default ButtonGroupPage;
