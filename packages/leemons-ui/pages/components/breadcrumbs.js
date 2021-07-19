import React from 'react';
import { FolderIcon, DocumentAddIcon } from '@heroicons/react/outline';
import ClassTable from '../../src/components/ClassTable';
import Wrapper from '../../src/components/Wrapper';
import { Breadcrumbs, Divider } from '../../src/components/ui';

function BreadCrumbsPage() {
  const data = {
    showType: true,
    components: [{ class: 'breadcrumbs', desc: 'Container element' }],
  };

  return (
    <main>
      <h2 className="mt-2 mb-6 text-5xl font-bold">
        <span className="text-primary">Breadcrumbs</span>
      </h2>
      <div className="flex-grow p-4">
        <div className="text-xl font-bold">Examples</div>

        <Wrapper classes="flex items-start flex-col space-y-2" title="breadcrumbs">
          <Breadcrumbs>
            <li>
              <a>Home</a>
            </li>
            <li>
              <a>Documents</a>
            </li>
            <li>Add Document</li>
          </Breadcrumbs>
        </Wrapper>

        <Wrapper classes="flex items-start flex-col space-y-2" title="breadcrumbs with icon">
          <Breadcrumbs>
            <li>
              <a>
                <FolderIcon className="w-4 h-4 mr-2 stroke-current" />
                Home
              </a>
            </li>
            <li>
              <a>
                <FolderIcon className="w-4 h-4 mr-2 stroke-current" />
                Documents
              </a>
            </li>
            <li>
              <DocumentAddIcon className="w-4 h-4 mr-2 stroke-current" />
              Add Document
            </li>
          </Breadcrumbs>
        </Wrapper>

        <Wrapper title="breadcrumbs colors">
          <div classes="flex items-start flex-col space-y-2">
            <Breadcrumbs color="primary">
              <li>
                <a>Home</a>
              </li>
              <li>
                <a>Documents</a>
              </li>
              <li>Add Document</li>
            </Breadcrumbs>
            <Breadcrumbs color="secondary">
              <li>
                <a>Home</a>
              </li>
              <li>
                <a>Documents</a>
              </li>
              <li>Secondary</li>
            </Breadcrumbs>
            <Breadcrumbs color="error">
              <li>
                <a>Home</a>
              </li>
              <li>
                <a>Documents</a>
              </li>
              <li>Error</li>
            </Breadcrumbs>
          </div>
        </Wrapper>

        <Wrapper title="breadcrumbs sizes">
          <div classes="flex items-start flex-col space-y-2">
            <Breadcrumbs className="text-lg">
              <li>
                <a>Home</a>
              </li>
              <li>
                <a>Documents</a>
              </li>
              <li>Add Document</li>
            </Breadcrumbs>
            <Breadcrumbs className="text-base">
              <li>
                <a>Home</a>
              </li>
              <li>
                <a>Documents</a>
              </li>
              <li>Add Document</li>
            </Breadcrumbs>
            <Breadcrumbs>
              <li>
                <a>Home</a>
              </li>
              <li>
                <a>Documents</a>
              </li>
              <li>Add Document</li>
            </Breadcrumbs>
            <Breadcrumbs className="text-2xs">
              <li>
                <a>Home</a>
              </li>
              <li>
                <a>Documents</a>
              </li>
              <li>Add Document</li>
            </Breadcrumbs>
          </div>
        </Wrapper>

        <Wrapper classes="flex items-start flex-col space-y-2" title="breadcrumbs overflow scroll">
          <Breadcrumbs className="max-w-xs">
            <li>
              <a>If you set max-width</a>
            </li>
            <li>
              <a>or the list</a>
            </li>
            <li>
              <a>gets larger than</a>
            </li>
            <li>
              <a>the container</a>
            </li>
            <li>
              <a>it will scroll</a>
            </li>
          </Breadcrumbs>
        </Wrapper>

        <Divider className="my-6" />
        <ClassTable data={data} />
      </div>
    </main>
  );
}

export default BreadCrumbsPage;
