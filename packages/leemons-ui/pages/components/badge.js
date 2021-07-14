import React from 'react';
import { XIcon } from '@heroicons/react/outline';
import { Badge, Button } from '../../src/components/ui';
import ClassTable from '../../src/components/ClassTable';
import Wrapper from '../../src/components/Wrapper';

function AvatarPage() {
  const data = {
    showType: true,
    components: [{ class: 'badge', desc: 'Container element' }],
    utilities: [
      { class: 'badge-outline', desc: 'transparent badge with [colorful] border' },
      { class: 'badge-primary', desc: 'badge with `primary` color' },
      { class: 'badge-secondary', desc: 'badge with `secondary` color' },
      { class: 'badge-accent', desc: 'badge with `accent` color' },
      { class: 'badge-ghost', desc: 'badge with `ghost` color' },
      { class: 'badge-info', desc: 'badge with `info` color' },
      { class: 'badge-success', desc: 'badge with `success` color' },
      { class: 'badge-warning', desc: 'badge with `warning` color' },
      { class: 'badge-error', desc: 'badge with `error` color' },
      { class: 'badge-lg', desc: 'badge with large size' },
      { class: 'badge-sm', desc: 'badge with small size' },
    ],
  };

  return (
    <div className="flex-grow p-4" data-theme="light">
      <ClassTable data={data} />
      <div className="divider my-6"></div>
      <div className="text-xl font-bold">Examples</div>

      <Wrapper
        className="flex flex-wrap items-start md:space-x-2 space-x-0 space-y-2 md:space-y-0 flex-col md:flex-row"
        title="badge"
      >
        <Badge>neutral</Badge>
        <Badge className="badge-primary">primary</Badge>
        <Badge className="badge-secondary">secondary</Badge>
        <Badge className="badge-accent">accent</Badge>
        <Badge className="badge-ghost">ghost</Badge>
      </Wrapper>

      <Wrapper
        className="flex flex-wrap items-start md:space-x-2 space-x-0 space-y-2 md:space-y-0 flex-col md:flex-row"
        title="badge size"
      >
        <Badge className="badge-ghost badge-lg">987,654</Badge>
        <Badge className="badge-ghost">987,654</Badge>
        <Badge className="badge-ghost badge-sm">987,654</Badge>
      </Wrapper>

      <Wrapper
        className="flex flex-wrap items-start md:space-x-2 space-x-0 space-y-2 md:space-y-0 flex-col md:flex-row"
        title="badge variants"
      >
        <Badge className="badge-info">
          <XIcon className="inline-block w-4 h-4 mr-2 stroke-current" />
          info
        </Badge>
        <Badge className="badge-success">
          <XIcon className="inline-block w-4 h-4 mr-2 stroke-current" />
          success
        </Badge>
        <Badge className="badge-warning">
          <XIcon className="inline-block w-4 h-4 mr-2 stroke-current" />
          warning
        </Badge>
        <Badge className="badge-error">
          <XIcon className="inline-block w-4 h-4 mr-2 stroke-current" />
          error
        </Badge>
      </Wrapper>

      <Wrapper
        className="flex flex-wrap items-start md:space-x-2 space-x-0 space-y-2 md:space-y-0 flex-col md:flex-row"
        title="badge outline"
      >
        <Badge className="badge-outline">neutral</Badge>
        <Badge className="badge-primary badge-outline">primary</Badge>
        <Badge className="badge-secondary badge-outline">secondary</Badge>
        <Badge className="badge-accent badge-outline">accent</Badge>
      </Wrapper>

      <Wrapper
        className="flex flex-wrap items-start md:space-x-2 space-x-0 space-y-2 md:space-y-0 flex-col md:flex-row"
        title="Badge in text"
      >
        <div>
          <div>
            <h2 className="mb-5 text-2xl">
              Heading
              <Badge className="badge-outline ml-2">New</Badge>
            </h2>
          </div>
          <div>
            <h2 className="mb-5 text-xl">
              Heading
              <Badge className="badge-outline ml-2">New</Badge>
            </h2>
          </div>
          <div>
            <h2 className="mb-5 text-lg">
              Heading
              <Badge className="badge-outline ml-2">New</Badge>
            </h2>
          </div>
          <div>
            <h2 className="mb-5 text-md">
              Heading
              <Badge className="badge-outline ml-2">New</Badge>
            </h2>
          </div>
          <div>
            <h2 className="mb-5 text-sm">
              Heading
              <Badge className="badge-outline ml-2">New</Badge>
            </h2>
          </div>
        </div>
      </Wrapper>

      <Wrapper
        className="flex flex-wrap items-start md:space-x-2 space-x-0 space-y-2 md:space-y-0 flex-col md:flex-row"
        title="badge in button"
      >
        <Button className="">
          Version 2.7.0
          <Badge className="ml-2">new</Badge>
        </Button>
        <Button className="btn-primary">
          Inbox
          <Badge className="ml-2 badge-outline">3</Badge>
        </Button>
        <Button className="btn-secondary btn-outline">
          Notifications
          <Badge className="ml-2 badge-outline">+999</Badge>
        </Button>
      </Wrapper>
    </div>
  );
}

export default AvatarPage;
