import React from 'react';
import { XIcon } from '@heroicons/react/outline';
import { Tooltip, Button, Divider, Badge } from '../../src/components/ui';
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
        <div className="prose text-base-content mb-6">
          <p>
            The Tooltip component uses the amazing <a href="https://popper.js.org/">Popper.js</a>{' '}
            positioning engine under the hood, through the outstanding{' '}
            <Badge outlined>
              <a href="https://github.com/mohsinulhaq/react-popper-tooltip">react-popper-tooltip</a>
            </Badge>{' '}
            implementation.
          </p>
        </div>

        <div className="text-xl font-bold">Examples</div>

        <Wrapper title="tooltip" classes="flex justify-center my-6">
          <Tooltip content="hello">
            <Button>Hover me</Button>
          </Tooltip>
        </Wrapper>

        <Wrapper title="tooltip-open" classes="flex justify-center my-6">
          <Tooltip open content="hello">
            <button className="btn">open by default</button>
          </Tooltip>
        </Wrapper>

        <Wrapper title="tooltip-bottom" classes="flex justify-center my-6">
          <Tooltip placement="bottom" open content="hello">
            <button className="btn">bottom</button>
          </Tooltip>
        </Wrapper>

        <Wrapper title="tooltip-left" classes="flex justify-center my-6">
          <Tooltip placement="left" open content="hello">
            <button className="btn">left</button>
          </Tooltip>
        </Wrapper>

        <Wrapper title="tooltip-right" classes="flex justify-center my-6">
          <Tooltip placement="right" open content="hello">
            <button className="btn">right</button>
          </Tooltip>
        </Wrapper>

        <Wrapper title="with colors">
          <div className="grid grid-cols-3 lg:grid-cols-5 my-10 place-items-center gap-y-16">
            <Tooltip open content="neutral">
              <button className="btn">neutral</button>
            </Tooltip>
            <Tooltip color="primary" open content="primary">
              <button className="btn btn-primary">primary</button>
            </Tooltip>
            <Tooltip color="secondary" open content="secondary">
              <button className="btn btn-secondary">secondary</button>
            </Tooltip>
            <Tooltip color="accent" open content="accent">
              <button className="btn btn-accent">accent</button>
            </Tooltip>
            <Tooltip color="info" open content="info">
              <button className="btn btn-info">info</button>
            </Tooltip>
            <Tooltip color="success" open content="success">
              <button className="btn btn-success">success</button>
            </Tooltip>
            <Tooltip color="warning" open content="warning">
              <button className="btn btn-warning">warning</button>
            </Tooltip>
            <Tooltip color="error" open content="error">
              <button className="btn btn-error">error</button>
            </Tooltip>
          </div>
        </Wrapper>

        <Wrapper title="Sizes">
          <div className="grid grid-cols-1 place-items-start gap-y-6">
            <Tooltip
              open
              color="primary"
              placement="right"
              size="lg"
              className="sharp"
              content="I'm large and sharp"
            >
              <Button color="primary">Button</Button>
            </Tooltip>

            <Tooltip open color="secondary" placement="right" content="I'm normal">
              <Button color="secondary">Button</Button>
            </Tooltip>

            <Tooltip open color="accent" placement="right" size="xs" content="I'm small">
              <Button color="accent">Button</Button>
            </Tooltip>
          </div>
        </Wrapper>

        <Wrapper title="Options">
          <p>
            You can include a tooltip anywhere in a paragraph, and have the tooltip follow the
            cursor as it moves through the{' '}
            <Tooltip
              color="primary"
              className="sharp"
              followCursor
              content={
                <span>
                  In addition, you can include <span className="text-lg font-bold">HTML</span>{' '}
                  content or other components within the Tooltip.
                </span>
              }
            >
              <span className="text-primary">object</span>
            </Tooltip>{' '}
            that opens it.
          </p>
        </Wrapper>

        <Divider className="my-6" />
        <ClassTable data={data} />
      </div>
    </main>
  );
}

export default TooltipPage;
