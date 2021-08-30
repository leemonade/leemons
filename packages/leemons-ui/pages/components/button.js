import React from 'react';
import { XIcon, ChevronRightIcon } from '@heroicons/react/outline';
import { Button, Divider } from '../../src/components/ui';
import ClassTable from '../../src/components/ClassTable';
import Wrapper from '../../src/components/Wrapper';

function ButtonPage() {
  const data = {
    showType: true,
    components: [{ class: 'btn', desc: 'Button' }],
    utilities: [
      { class: 'btn-lg', desc: 'Large button' },
      { class: 'btn-md', desc: 'Medium button (default)' },
      { class: 'btn-sm', desc: 'Small button' },
      { class: 'btn-xs', desc: 'Extra small button' },
      { class: 'btn-wide', desc: 'Wide button (more horizontal padding)' },
      { class: 'btn-block', desc: 'Full width button' },
      { class: 'btn-circle', desc: 'Circle button with a 1:1 ratio' },
      { class: 'btn-square', desc: 'Square button with a 1:1 ratio' },
      { class: 'btn-primary', desc: 'Button with `primary` color' },
      { class: 'btn-secondary', desc: 'Button with `secondary` color' },
      { class: 'btn-accent', desc: 'Button with `accent` color' },
      { class: 'btn-info', desc: 'Button with `info` color' },
      { class: 'btn-success', desc: 'Button with `success` color' },
      { class: 'btn-warning', desc: 'Button with `warning` color' },
      { class: 'btn-error', desc: 'Button with `error` color' },
      { class: 'btn-ghost', desc: 'Button with ghost style' },
      { class: 'btn-link', desc: 'Button styled as a link' },
      { class: 'btn-outline', desc: 'Transparent Button with colored border' },
      { class: 'btn-active', desc: 'Force button to show active state' },
      { class: 'btn-disabled', desc: 'Force button to show disabled state' },
      { class: 'glass', desc: 'Button with a glass effect' },
      { class: 'loading', desc: 'Shows loading spinner' },
      { class: 'no-animation', desc: 'Disables click animation' },
    ],
  };

  return (
    <main>
      <h2 className="mt-2 mb-6 text-5xl font-bold">
        <span className="text-primary">Button</span>
      </h2>

      <div className="flex-grow p-4">
        <div className="text-xl font-bold">Examples</div>

        <Wrapper title="button with brand colors">
          <div className="flex flex-wrap items-start md:space-x-2 space-y-2 md:space-y-0 flex-col md:flex-row">
            <Button>neutral</Button>
            <Button color="primary">primary</Button>
            <Button color="secondary">secondary</Button>
            <Button color="accent">accent</Button>
            <Button color="ghost">ghost</Button>
            <Button color="primary" className="btn-link">
              link
            </Button>
          </div>
        </Wrapper>

        <Wrapper title="text buttons">
          <div className="flex flex-wrap items-start md:space-x-2 space-y-2 md:space-y-0 flex-col md:flex-row">
            <Button color="primary" text>
              primary
            </Button>
            <Button color="secondary" text>
              secondary
            </Button>
            <Button color="accent" text>
              accent
            </Button>
            <Button color="ghost" text>
              ghost
            </Button>
          </div>
        </Wrapper>

        <Wrapper title="active state button">
          <div className="flex flex-wrap items-start md:space-x-2 space-y-2 md:space-y-0 flex-col md:flex-row">
            <Button className="btn-active" role="button" aria-pressed="true">
              neutral
            </Button>
            <Button color="primary" className="btn-active" role="button" aria-pressed="true">
              primary
            </Button>
            <Button color="secondary" className="btn-active" role="button" aria-pressed="true">
              secondary
            </Button>
            <Button color="accent" className="btn-active" role="button" aria-pressed="true">
              accent
            </Button>
            <Button className="btn-link btn-active" role="button" aria-pressed="true">
              link
            </Button>
          </div>
        </Wrapper>

        <Wrapper title="outline button">
          <div className="flex flex-wrap items-start md:space-x-2 space-y-2 md:space-y-0 flex-col md:flex-row">
            <Button outlined>neutral</Button>
            <Button outlined color="primary">
              primary
            </Button>
            <Button outlined color="secondary">
              secondary
            </Button>
            <Button outlined color="accent">
              accent
            </Button>
          </div>
        </Wrapper>

        <Wrapper title="disabled button">
          <div className="flex flex-wrap items-start md:space-x-2 space-y-2 md:space-y-0 flex-col md:flex-row">
            <Button disabled>neutral</Button>
            <Button disabled color="primary">
              primary
            </Button>
            <Button disabled color="secondary">
              secondary
            </Button>
            <Button disabled className="btn-link">
              link
            </Button>
            <Button className="btn-disabled" tabIndex="-1" role="button" aria-disabled="true">
              visually disabled
            </Button>
          </div>
        </Wrapper>

        <Wrapper title="rounded button">
          <div className="flex flex-wrap items-start md:space-x-2 space-y-2 md:space-y-0 flex-col md:flex-row">
            <Button rounded>neutral</Button>
            <Button color="primary" rounded>
              primary
            </Button>
            <Button color="secondary" rounded>
              secondary
            </Button>
            <Button color="accent" rounded>
              accent
            </Button>
            <Button color="primary" rounded outlined>
              Outlined
            </Button>
          </div>
        </Wrapper>

        <Wrapper title="button with state colors">
          <div className="flex flex-wrap items-start md:space-x-2 space-y-2 md:space-y-0 flex-col md:flex-row">
            <Button color="info">info</Button>
            <Button color="success">success</Button>
            <Button color="warning">warning</Button>
            <Button color="error">error</Button>
          </div>
        </Wrapper>

        <Wrapper title="button with diffrent HTML tags">
          <div className="flex flex-wrap items-start md:space-x-2 space-y-2 md:space-y-0 flex-col md:flex-row">
            <a className="btn" href="#" role="button">
              Link
            </a>
            <button className="btn" type="submit">
              Button
            </button>
            <input className="btn" type="button" value="Input" />
            <input className="btn" type="submit" value="Submit" />
            <input className="btn" type="reset" value="Reset" />
          </div>
        </Wrapper>

        <Wrapper title="button size">
          <div className="flex flex-wrap items-start md:space-x-2 space-y-2 md:space-y-0 flex-col md:flex-row">
            <Button className="btn-lg">Large</Button>
            <Button className="">Normal</Button>
            <Button className="btn-sm">Small</Button>
            <Button className="btn-xs">Tiny</Button>
          </div>
        </Wrapper>

        <Wrapper title="button wide">
          <div className="flex flex-wrap items-start space-y-2 flex-col">
            <Button wide className=" btn-lg">
              large
            </Button>
            <Button wide>normal</Button>
            <Button wide className="bbtn-sm">
              small
            </Button>
            <Button wide className="bbtn-xs">
              tiny
            </Button>
          </div>
        </Wrapper>

        <Wrapper title="icon button start (rounded)">
          <div className="flex flex-wrap items-start md:space-x-2 space-y-2 md:space-y-0 flex-col md:flex-row">
            <Button rounded className="btn-lg">
              <XIcon className="inline-block w-6 h-6 mr-2 -ml-2 stroke-current" />
              Large
            </Button>
            <Button rounded>
              <XIcon className="inline-block w-6 h-6 mr-2 -ml-2 stroke-current" />
              Normal
            </Button>
            <Button rounded className="btn-sm">
              <XIcon className="inline-block w-4 h-4 mr-2 -ml-1 stroke-current" />
              Small
            </Button>
            <Button rounded className="btn-xs">
              <XIcon className="inline-block w-4 h-4 mr-1 -ml-1 stroke-current" />
              Tiny
            </Button>
          </div>
        </Wrapper>

        <Wrapper title="icon button end (rounded)">
          <div className="flex flex-wrap items-start md:space-x-2 space-y-2 md:space-y-0 flex-col md:flex-row">
            <Button rounded className="btn-lg">
              Large
              <ChevronRightIcon className="inline-block w-6 h-6 ml-2 -mr-2 stroke-current" />
            </Button>
            <Button rounded>
              Normal
              <ChevronRightIcon className="inline-block w-6 h-6 ml-2 -mr-2 stroke-current" />
            </Button>
            <Button rounded className="btn-sm">
              Small
              <ChevronRightIcon className="inline-block w-4 h-4 ml-2 -mr-1 stroke-current" />
            </Button>
            <Button rounded className="btn-xs">
              Tiny
              <ChevronRightIcon className="inline-block w-4 h-4 ml-1 -mr-1 stroke-current" />
            </Button>
          </div>
        </Wrapper>

        <Wrapper title="button shapes">
          <div className="flex flex-wrap items-start md:space-x-2 space-y-2 md:space-y-0 flex-col md:flex-row">
            <Button className="btn-circle btn-lg">
              <XIcon className="inline-block w-6 h-6 stroke-current" />
            </Button>
            <Button className="btn-circle">
              <XIcon className="inline-block w-6 h-6 stroke-current" />
            </Button>
            <Button className="btn-circle btn-sm">
              <XIcon className="inline-block w-4 h-4 stroke-current" />
            </Button>
            <Button className="btn-circle btn-xs">
              <XIcon className="inline-block w-4 h-4 stroke-current" />
            </Button>
          </div>
        </Wrapper>

        <Wrapper title="button shapes">
          <div className="flex flex-wrap items-start md:space-x-2 space-y-2 md:space-y-0 flex-col md:flex-row">
            <Button square className="btn-lg">
              <XIcon className="inline-block w-6 h-6 stroke-current" />
            </Button>
            <Button square>
              <XIcon className="inline-block w-6 h-6 stroke-current" />
            </Button>
            <Button square className="btn-sm">
              <XIcon className="inline-block w-4 h-4 stroke-current" />
            </Button>
            <Button square className="btn-xs">
              <XIcon className="inline-block w-4 h-4 stroke-current" />
            </Button>
          </div>
        </Wrapper>

        <Wrapper title="button shapes">
          <div className="flex flex-wrap items-start md:space-x-2 space-y-2 md:space-y-0 flex-col md:flex-row">
            <Button outlined circle className="btn-lg">
              <XIcon className="inline-block w-6 h-6 stroke-current" />
            </Button>
            <Button outlined circle>
              <XIcon className="inline-block w-6 h-6 stroke-current" />
            </Button>
            <Button outlined circle className="btn-sm">
              <XIcon className="inline-block w-4 h-4 stroke-current" />
            </Button>
            <Button outlined circle className="btn-xs">
              <XIcon className="inline-block w-4 h-4 stroke-current" />
            </Button>
          </div>
        </Wrapper>

        <Wrapper title="button shapes">
          <div className="flex flex-wrap items-start md:space-x-2 space-y-2 md:space-y-0 flex-col md:flex-row">
            <Button outlined square className="btn-lg">
              <XIcon className="inline-block w-6 h-6 stroke-current" />
            </Button>
            <Button outlined square>
              <XIcon className="inline-block w-6 h-6 stroke-current" />
            </Button>
            <Button outlined square className="btn-sm">
              <XIcon className="inline-block w-4 h-4 stroke-current" />
            </Button>
            <Button outlined square className="btn-xs">
              <XIcon className="inline-block w-4 h-4 stroke-current" />
            </Button>
          </div>
        </Wrapper>

        <Wrapper
          className="flex flex-wrap items-start md:space-x-2 space-y-2 md:space-y-0 flex-col md:flex-row"
          title="button block"
        >
          <Button className="btn-block">block</Button>
        </Wrapper>

        <Wrapper title="button loading">
          <div className="flex flex-wrap items-start md:space-x-2 space-y-2 md:space-y-0 flex-col md:flex-row">
            <Button className="btn-lg loading">loading</Button>
            <Button className="btn-primary loading">loading</Button>
            <Button className="btn-sm btn-secondary loading">loading</Button>
            <Button className="btn-xs btn-accent loading">loading</Button>
          </div>
        </Wrapper>

        <Wrapper title="button loading">
          <div className="flex flex-wrap items-start md:space-x-2 space-y-2 md:space-y-0 flex-col md:flex-row">
            <Button outlined loading className="btn-sm">
              loading
            </Button>
            <Button color="primary" outlined loading className="btn-sm">
              loading
            </Button>
            <Button color="secondary" outlined loading className="btn-sm">
              loading
            </Button>
            <Button color="accent" outlined loading className="btn-sm">
              loading
            </Button>
          </div>
        </Wrapper>

        <Wrapper title="button loading">
          <div className="flex flex-wrap items-start md:space-x-2 space-y-2 md:space-y-0 flex-col md:flex-row">
            <Button square loading className="btn-lg"></Button>
            <Button square loading></Button>
            <Button square loading className="btn-sm"></Button>
            <Button square loading className="btn-xs"></Button>
          </div>
        </Wrapper>

        <Wrapper title="button loading">
          <div className="flex flex-wrap items-start md:space-x-2 space-y-2 md:space-y-0 flex-col md:flex-row">
            <Button circle loading className="btn-lg"></Button>
            <Button circle loading></Button>
            <Button circle loading className="btn-sm"></Button>
            <Button circle loading className="btn-xs"></Button>
          </div>
        </Wrapper>

        <Wrapper
          className="flex flex-wrap items-start md:space-x-2 space-y-2 md:space-y-0 flex-col md:flex-row"
          title="disable animation"
        >
          <Button className="btn-primary no-animation">I don&apos;t have click animation</Button>
        </Wrapper>

        <Divider className="my-6" />

        <ClassTable data={data} />
      </div>
    </main>
  );
}

export default ButtonPage;
