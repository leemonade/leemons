import React from 'react';
import { XIcon } from '@heroicons/react/outline';
import { Badge, Button, Divider } from '../../src/components/ui';
import ClassTable from '../../src/components/ClassTable';
import Wrapper from '../../src/components/Wrapper';

function BadgePage() {
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
    <main>
      <h2 className="mt-2 mb-6 text-5xl font-bold">
        <span className="text-primary">Badge</span>
      </h2>
      <div className="flex-grow p-4">
        <div className="text-xl font-bold">Examples</div>

        <Wrapper
          className="flex flex-wrap items-start md:space-x-2 space-x-0 space-y-2 md:space-y-0 flex-col md:flex-row"
          title="badge"
        >
          <Badge>neutral</Badge>
          <Badge color="primary">primary</Badge>
          <Badge color="secondary">secondary</Badge>
          <Badge color="accent">accent</Badge>
          <Badge color="ghost">ghost</Badge>
        </Wrapper>

        <Wrapper
          className="flex flex-wrap items-start md:space-x-2 space-x-0 space-y-2 md:space-y-0 flex-col md:flex-row"
          title="badge size"
        >
          <Badge color="ghost" className="badge-lg">
            987,654
          </Badge>
          <Badge color="ghost">987,654</Badge>
          <Badge color="ghost" className="badge-sm">
            987,654
          </Badge>
        </Wrapper>

        <Wrapper
          className="flex flex-wrap items-start md:space-x-2 space-x-0 space-y-2 md:space-y-0 flex-col md:flex-row"
          title="badge variants"
        >
          <Badge color="info">
            <XIcon className="inline-block w-4 h-4 mr-2 stroke-current" />
            info
          </Badge>
          <Badge color="success">
            <XIcon className="inline-block w-4 h-4 mr-2 stroke-current" />
            success
          </Badge>
          <Badge color="warning">
            <XIcon className="inline-block w-4 h-4 mr-2 stroke-current" />
            warning
          </Badge>
          <Badge color="error">
            <XIcon className="inline-block w-4 h-4 mr-2 stroke-current" />
            error
          </Badge>
        </Wrapper>

        <Wrapper
          className="flex flex-wrap items-start md:space-x-2 space-x-0 space-y-2 md:space-y-0 flex-col md:flex-row"
          title="badge outline"
        >
          <Badge outlined>neutral</Badge>
          <Badge outlined color="primary">
            primary
          </Badge>
          <Badge outlined color="secondary" className="p-2">
            <span className="px-2">secondary</span>
            <Button color="ghost" circle className="btn-xs">
              <XIcon className="inline-block w-4 h-4 stroke-current" />
            </Button>
          </Badge>
          <Badge outlined color="accent">
            accent
          </Badge>
        </Wrapper>

        <Wrapper
          className="flex flex-wrap items-start md:space-x-2 space-x-0 space-y-2 md:space-y-0 flex-col md:flex-row"
          title="Badge in text"
        >
          <div>
            <div>
              <h2 className="mb-5 text-2xl">
                Heading
                <Badge outlined className="ml-2">
                  New
                </Badge>
              </h2>
            </div>
            <div>
              <h2 className="mb-5 text-xl">
                Heading
                <Badge outlined className="ml-2">
                  New
                </Badge>
              </h2>
            </div>
            <div>
              <h2 className="mb-5 text-lg">
                Heading
                <Badge outlined className="ml-2">
                  New
                </Badge>
              </h2>
            </div>
            <div>
              <h2 className="mb-5 text-md">
                Heading
                <Badge outlined className="ml-2">
                  New
                </Badge>
              </h2>
            </div>
            <div>
              <h2 className="mb-5 text-sm">
                Heading
                <Badge outlined className="ml-2">
                  New
                </Badge>
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
          <Button color="primary">
            Inbox
            <Badge outlined className="ml-2">
              3
            </Badge>
          </Button>
          <Button outlined color="secondary">
            Notifications
            <Badge outlined className="ml-2">
              +999
            </Badge>
          </Button>
        </Wrapper>
        <Divider className="my-6" />
        <ClassTable data={data} />
      </div>
    </main>
  );
}

export default BadgePage;
