import React from 'react';
import { XIcon } from '@heroicons/react/outline';
import { Tooltip, Button, Divider } from '../../src/components/ui';
import ClassTable from '../../src/components/ClassTable';
import Wrapper from '../../src/components/Wrapper';

function TooltipPage() {
  const data = {
    showType: true,
    components: [{ class: 'tooltip', desc: 'Container element' }],
    utilities: [
      { class: 'tooltip-open', desc: 'Force open tooltip' },
      { class: 'tooltip-bottom', desc: 'Put tooltip on bottom' },
      { class: 'tooltip-left', desc: 'Put tooltip on left' },
      { class: 'tooltip-right', desc: 'Put tooltip on right' },
      { class: 'tooltip-primary', desc: 'Adds `primary` color to tooltip' },
      { class: 'tooltip-secondary', desc: 'Adds `secondary` color to tooltip' },
      { class: 'tooltip-accent', desc: 'Adds `accent` color to tooltip' },
      { class: 'tooltip-info', desc: 'Adds `info` color to tooltip' },
      { class: 'tooltip-success', desc: 'Adds `success` color to tooltip' },
      { class: 'tooltip-warning', desc: 'Adds `warning` color to tooltip' },
      { class: 'tooltip-error', desc: 'Adds `error` color to tooltip' },
    ],
  };

  return (
    <main>
      <h2 className="mt-2 mb-6 text-5xl font-bold">
        <span className="text-primary">Tooltip</span>
      </h2>
      <div className="flex-grow p-4">
        <div className="text-xl font-bold">Examples</div>

        <Wrapper title="tooltip" classes="flex justify-center my-6">
          <Tooltip content="hello">
            <Button>Hover me</Button>
          </Tooltip>
        </Wrapper>

        <Wrapper title="tooltip-open" classes="flex justify-center my-6">
          <Tooltip className="tooltip-open" content="hello">
            <button className="btn">open by default</button>
          </Tooltip>
        </Wrapper>

        <Wrapper title="tooltip-bottom" classes="flex justify-center my-6">
          <Tooltip position="bottom" className="tooltip-open" content="hello">
            <button className="btn">bottom</button>
          </Tooltip>
        </Wrapper>

        <Wrapper title="tooltip-left" classes="flex justify-center my-6">
          <Tooltip position="left" className="tooltip-open" content="hello">
            <button className="btn">left</button>
          </Tooltip>
        </Wrapper>

        <Wrapper title="tooltip-right" classes="flex justify-center my-6">
          <Tooltip position="right" className="tooltip-open" content="hello">
            <button className="btn">right</button>
          </Tooltip>
        </Wrapper>

        <Wrapper title="with colors">
          <div className="grid grid-cols-3 lg:grid-cols-5 my-10 place-items-center gap-y-16">
            <Tooltip className="tooltip-open" content="neutral">
              <button className="btn">neutral</button>
            </Tooltip>
            <Tooltip color="primary" className="tooltip-open" content="primary">
              <button className="btn btn-primary">primary</button>
            </Tooltip>
            <Tooltip color="secondary" className="tooltip-open" content="secondary">
              <button className="btn btn-secondary">secondary</button>
            </Tooltip>
            <Tooltip color="accent" className="tooltip-open" content="accent">
              <button className="btn btn-accent">accent</button>
            </Tooltip>
            <Tooltip color="info" className="tooltip-open" content="info">
              <button className="btn btn-info">info</button>
            </Tooltip>
            <Tooltip color="success" className="tooltip-open" content="success">
              <button className="btn btn-success">success</button>
            </Tooltip>
            <Tooltip color="warning" className="tooltip-open" content="warning">
              <button className="btn btn-warning">warning</button>
            </Tooltip>
            <Tooltip color="error" className="tooltip-open" content="error">
              <button className="btn btn-error">error</button>
            </Tooltip>
          </div>
        </Wrapper>

        <Wrapper title="Sizes">
          <div className="grid grid-cols-1 place-items-center gap-y-6">
            <Tooltip
              color="primary"
              position="right"
              className="tooltip-open tooltip-lg sharp"
              content="I'm large"
            >
              <Button color="primary">Button</Button>
            </Tooltip>

            <Tooltip
              color="secondary"
              position="right"
              className="tooltip-open"
              content="I'm normal"
            >
              <Button color="secondary">Button</Button>
            </Tooltip>

            <Tooltip
              color="accent"
              position="right"
              className="tooltip-open tooltip-xs"
              content="I'm small"
            >
              <Button color="accent">Button</Button>
            </Tooltip>
          </div>
        </Wrapper>

        <Divider className="my-6" />
        <ClassTable data={data} />
      </div>
    </main>
  );
}

export default TooltipPage;
