import React from 'react';
import { XIcon, ChevronRightIcon } from '@heroicons/react/outline';
import { Button } from '../../src/components/ui';
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
    <div className="flex-grow p-4" data-theme="light">
      <ClassTable data={data} />
      <div className="divider my-6"></div>
      <div className="text-xl font-bold">Examples</div>

      <Wrapper
        className="flex flex-wrap items-start md:space-x-2 space-y-2 md:space-y-0 flex-col md:flex-row"
        title="button with brand colors"
      >
        <Button className="">neutral</Button>
        <Button className="btn-primary">primary</Button>
        <Button className="btn-secondary">secondary</Button>
        <Button className="btn-accent">accent</Button>
        <Button className="btn-ghost">ghost</Button>
        <Button className="btn-link">link</Button>
      </Wrapper>

      <Wrapper
        className="flex flex-wrap items-start md:space-x-2 space-y-2 md:space-y-0 flex-col md:flex-row"
        title="active state button"
      >
        <Button className="btn-active" role="button" aria-pressed="true">
          neutral
        </Button>
        <Button className="btn-primary btn-active" role="button" aria-pressed="true">
          primary
        </Button>
        <Button className="btn-secondary btn-active" role="button" aria-pressed="true">
          secondary
        </Button>
        <Button className="btn-accent btn-active" role="button" aria-pressed="true">
          accent
        </Button>
        <Button className="btn-link btn-active" role="button" aria-pressed="true">
          link
        </Button>
      </Wrapper>

      <Wrapper
        className="flex flex-wrap items-start md:space-x-2 space-y-2 md:space-y-0 flex-col md:flex-row"
        title="outline button"
      >
        <Button className="btn-outline">neutral</Button>
        <Button className="btn-outline btn-primary">primary</Button>
        <Button className="btn-outline btn-secondary">secondary</Button>
        <Button className="btn-outline btn-accent">accent</Button>
      </Wrapper>

      <Wrapper
        className="flex flex-wrap items-start md:space-x-2 space-y-2 md:space-y-0 flex-col md:flex-row"
        title="disabled button"
      >
        <Button disabled>neutral</Button>
        <Button disabled className="btn-primary">
          primary
        </Button>
        <Button disabled className="btn-ghost">
          ghost
        </Button>
        <Button disabled className="btn-link">
          link
        </Button>
        <Button className="btn-disabled" tabIndex="-1" role="button" aria-disabled="true">
          visually disabled
        </Button>
      </Wrapper>

      <Wrapper
        className="flex flex-wrap items-start md:space-x-2 space-y-2 md:space-y-0 flex-col md:flex-row"
        title="button with state colors"
      >
        <Button className="btn-info">info</Button>
        <Button className="btn-success">success</Button>
        <Button className="btn-warning">warning</Button>
        <Button className="btn-error">error</Button>
      </Wrapper>

      <Wrapper className="flex flex-wrap items-start space-x-2 flex-row" title="responsive buttons">
        <Button className="btn-xs md:btn-sm lg:btn-md xl:btn-lg">resize your browser</Button>
        <Button className="btn-square btn-xs md:btn-sm lg:btn-md xl:btn-lg">
          <XIcon className="inline-block w-4 h-4 stroke-current md:w-6 md:h-6" />
        </Button>
        <Button className="btn-circle btn-xs md:btn-sm lg:btn-md xl:btn-lg">
          <XIcon className="inline-block w-4 h-4 stroke-current md:w-6 md:h-6" />
        </Button>
      </Wrapper>

      <Wrapper
        className="flex flex-wrap items-start md:space-x-2 space-y-2 md:space-y-0 flex-col md:flex-row"
        title="button with diffrent HTML tags"
      >
        <a className="btn" href="#" role="button">
          Link
        </a>
        <button className="btn" type="submit">
          Button
        </button>
        <input className="btn" type="button" value="Input" />
        <input className="btn" type="submit" value="Submit" />
        <input className="btn" type="reset" value="Reset" />
      </Wrapper>

      <Wrapper
        className="flex flex-wrap items-start md:space-x-2 space-y-2 md:space-y-0 flex-col md:flex-row"
        title="button size"
      >
        <Button className="btn-lg">Large</Button>
        <Button className="">Normal</Button>
        <Button className="btn-sm">Small</Button>
        <Button className="btn-xs">Tiny</Button>
      </Wrapper>

      <Wrapper className="flex flex-wrap items-start space-y-2 flex-col" title="button wide">
        <Button className="btn-wide btn-lg">large</Button>
        <Button className="btn-wide">normal</Button>
        <Button className="btn-wide btn-sm">small</Button>
        <Button className="btn-wide btn-xs">tiny</Button>
      </Wrapper>

      <Wrapper
        className="flex flex-wrap items-start md:space-x-2 space-y-2 md:space-y-0 flex-col md:flex-row"
        title="icon button start"
      >
        <Button className="btn-lg">
          <XIcon className="inline-block w-6 h-6 mr-2 stroke-current" />
          Large
        </Button>
        <Button className="">
          <XIcon className="inline-block w-6 h-6 mr-2 stroke-current" />
          Normal
        </Button>
        <Button className="btn-sm">
          <XIcon className="inline-block w-4 h-4 mr-2 stroke-current" />
          Small
        </Button>
        <Button className="btn-xs">
          <XIcon className="inline-block w-4 h-4 mr-1 stroke-current" />
          Tiny
        </Button>
      </Wrapper>

      <Wrapper
        className="flex flex-wrap items-start md:space-x-2 space-y-2 md:space-y-0 flex-col md:flex-row"
        title="icon button end"
      >
        <Button className="btn-lg">
          Large
          <ChevronRightIcon className="inline-block w-6 h-6 ml-2 stroke-current" />
        </Button>
        <Button className="">
          Normal
          <ChevronRightIcon className="inline-block w-6 h-6 ml-2 stroke-current" />
        </Button>
        <Button className="btn-sm">
          Small
          <ChevronRightIcon className="inline-block w-4 h-4 ml-2 stroke-current" />
        </Button>
        <Button className="btn-xs">
          Tiny
          <ChevronRightIcon className="inline-block w-4 h-4 ml-1 stroke-current" />
        </Button>
      </Wrapper>

      <Wrapper
        className="flex flex-wrap items-start md:space-x-2 space-y-2 md:space-y-0 flex-col md:flex-row"
        title="button shapes"
      >
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
      </Wrapper>

      <Wrapper
        className="flex flex-wrap items-start md:space-x-2 space-y-2 md:space-y-0 flex-col md:flex-row"
        title="button shapes"
      >
        <Button className="btn-square btn-lg">
          <XIcon className="inline-block w-6 h-6 stroke-current" />
        </Button>
        <Button className="btn-square">
          <XIcon className="inline-block w-6 h-6 stroke-current" />
        </Button>
        <Button className="btn-square btn-sm">
          <XIcon className="inline-block w-4 h-4 stroke-current" />
        </Button>
        <Button className="btn-square btn-xs">
          <XIcon className="inline-block w-4 h-4 stroke-current" />
        </Button>
      </Wrapper>

      <Wrapper
        className="flex flex-wrap items-start md:space-x-2 space-y-2 md:space-y-0 flex-col md:flex-row"
        title="button shapes"
      >
        <Button className="btn-outline btn-circle btn-lg">
          <XIcon className="inline-block w-6 h-6 stroke-current" />
        </Button>
        <Button className="btn-outline btn-circle">
          <XIcon className="inline-block w-6 h-6 stroke-current" />
        </Button>
        <Button className="btn-outline btn-circle btn-sm">
          <XIcon className="inline-block w-4 h-4 stroke-current" />
        </Button>
        <Button className="btn-outline btn-circle btn-xs">
          <XIcon className="inline-block w-4 h-4 stroke-current" />
        </Button>
      </Wrapper>

      <Wrapper
        className="flex flex-wrap items-start md:space-x-2 space-y-2 md:space-y-0 flex-col md:flex-row"
        title="button shapes"
      >
        <Button className="btn-outline btn-square btn-lg">
          <XIcon className="inline-block w-6 h-6 stroke-current" />
        </Button>
        <Button className="btn-outline btn-square">
          <XIcon className="inline-block w-6 h-6 stroke-current" />
        </Button>
        <Button className="btn-outline btn-square btn-sm">
          <XIcon className="inline-block w-4 h-4 stroke-current" />
        </Button>
        <Button className="btn-outline btn-square btn-xs">
          <XIcon className="inline-block w-4 h-4 stroke-current" />
        </Button>
      </Wrapper>

      <Wrapper
        className="flex flex-wrap items-start md:space-x-2 space-y-2 md:space-y-0 flex-col md:flex-row"
        title="button block"
      >
        <Button className="btn-block">block</Button>
      </Wrapper>

      <Wrapper
        className="flex flex-wrap items-start md:space-x-2 space-y-2 md:space-y-0 flex-col md:flex-row"
        title="button loading"
      >
        <Button className="btn-lg loading">loading</Button>
        <Button className="btn-primary loading">loading</Button>
        <Button className="btn-sm btn-secondary loading">loading</Button>
        <Button className="btn-xs btn-accent loading">loading</Button>
      </Wrapper>

      <Wrapper
        className="flex flex-wrap items-start md:space-x-2 space-y-2 md:space-y-0 flex-col md:flex-row"
        title="button loading"
      >
        <Button className="btn-sm btn-outline btn-primary loading">loading</Button>
        <Button className="btn-sm btn-outline btn-secondary loading">loading</Button>
        <Button className="btn-sm btn-outline btn-accent loading">loading</Button>
        <Button className="btn-sm btn-ghost loading">loading</Button>
      </Wrapper>

      <Wrapper
        className="flex flex-wrap items-start md:space-x-2 space-y-2 md:space-y-0 flex-col md:flex-row"
        title="button loading"
      >
        <Button className="btn-lg btn-square loading"></Button>
        <Button className="btn-square loading"></Button>
        <Button className="btn-sm btn-square loading"></Button>
        <Button className="btn-xs btn-square loading"></Button>
      </Wrapper>

      <Wrapper
        className="flex flex-wrap items-start md:space-x-2 space-y-2 md:space-y-0 flex-col md:flex-row"
        title="button loading"
      >
        <Button className="btn-lg btn-circle loading"></Button>
        <Button className="btn-circle loading"></Button>
        <Button className="btn-sm btn-circle loading"></Button>
        <Button className="btn-xs btn-circle loading"></Button>
      </Wrapper>

      <Wrapper
        className="flex flex-wrap items-start md:space-x-2 space-y-2 md:space-y-0 flex-col md:flex-row"
        title="disable animation"
      >
        <Button className="btn-primary no-animation">I don&apos;t have click animation</Button>
      </Wrapper>
    </div>
  );
}

export default ButtonPage;
