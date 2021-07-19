import React from 'react';
import {
  InformationCircleIcon,
  FolderIcon,
  ExclamationCircleIcon,
  BanIcon,
  BellIcon,
  DotsVerticalIcon,
} from '@heroicons/react/outline';
import { Alert, Button, Divider } from '../../src/components/ui';
import ClassTable from '../../src/components/ClassTable';
import Wrapper from '../../src/components/Wrapper';

const data = {
  showType: true,
  components: [{ class: 'alert', desc: 'Container element' }],
  utilities: [
    { class: 'alert-info', desc: 'Alert with `info` color' },
    { class: 'alert-success', desc: 'Alert with `success` color' },
    { class: 'alert-warning', desc: 'Alert with `warning` color' },
    { class: 'alert-error', desc: 'Alert with `error` color' },
  ],
};

function AlertPage() {
  return (
    <main>
      <h2 className="mt-2 mb-6 text-5xl font-bold">
        <span className="text-primary">Alert</span>
      </h2>
      <div className="flex-grow p-4">
        <div className="text-xl font-bold">Examples</div>

        <Wrapper title="alert" className="flex flex-col space-y-2">
          <Alert>
            <div className="flex-1">
              <InformationCircleIcon className="w-6 h-6 mx-2 text-info" />
              <label>Lorem ipsum dolor sit amet, consectetur adip!</label>
            </div>
          </Alert>
        </Wrapper>

        <Wrapper title="alert state: info" className="flex flex-col space-y-2">
          <Alert color="info">
            <div className="flex-1">
              <InformationCircleIcon className="w-6 h-6 mx-2 stroke-current" />
              <label>Lorem ipsum dolor sit amet, consectetur adip!</label>
            </div>
          </Alert>
        </Wrapper>
        <Wrapper title="alert state: success" className="flex flex-col space-y-2">
          <Alert color="success">
            <div className="flex-1">
              <FolderIcon className="w-6 h-6 mx-2 stroke-current" />
              <label>Lorem ipsum dolor sit amet, consectetur adip!</label>
            </div>
          </Alert>
        </Wrapper>
        <Wrapper title="alert state: warning" className="flex flex-col space-y-2">
          <Alert color="warning">
            <div className="flex-1">
              <ExclamationCircleIcon className="w-6 h-6 mx-2 stroke-current" />
              <label>Lorem ipsum dolor sit amet, consectetur adip!</label>
            </div>
          </Alert>
        </Wrapper>
        <Wrapper title="alert state: error" className="flex flex-col space-y-2">
          <Alert color="error">
            <div className="flex-1">
              <BanIcon className="w-6 h-6 mx-2 stroke-current" />
              <label>Lorem ipsum dolor sit amet, consectetur adip!</label>
            </div>
          </Alert>
        </Wrapper>

        <Wrapper title="alert" className="flex flex-col space-y-2">
          <Alert>
            <div className="flex-1">
              <label className="mx-3">Lorem ipsum dolor sit amet, consectetur adip!</label>
            </div>
            <div className="flex-none">
              <Button className="btn-sm btn-ghost mr-2">Cancel</Button>
              <Button className="btn-sm btn-primary">Apply</Button>
            </div>
          </Alert>
        </Wrapper>
        <Wrapper title="alert" className="flex flex-col space-y-2">
          <Alert>
            <div className="flex-1">
              <BanIcon className="w-6 h-6 mx-2" color="#ff5722" />
              <label>Lorem ipsum dolor sit amet, consectetur adip!</label>
            </div>
            <div className="flex-none">
              <Button className="btn-sm btn-ghost">
                <BellIcon className="inline-block w-4 mr-2 stroke-current" />
                Remind me later
              </Button>
            </div>
          </Alert>
        </Wrapper>
        <Wrapper title="alert" className="flex flex-col space-y-2">
          <Alert>
            <div className="flex-1">
              <BellIcon className="flex-shrink-0 w-6 h-6 mx-2 text-success" />
              <label>
                <h4>Lorem ipsum dolor sit!</h4>
                <p className="text-sm text-base-content text-opacity-60">
                  Lorem ipsum dolor sit amet, consectetur adip! Lorem ipsum dolor sit amet,
                  consectetur adip!Lorem ipsum dolor sit amet, consectetur adip!Lorem ipsum dolor
                  sit amet, consectetur adip!Lorem ipsum dolor sit amet, consectetur adip!Lorem
                  ipsum dolor sit amet, consectetur adip!
                </p>
              </label>
            </div>
            <div className="flex-none">
              <Button className="btn-sm btn-ghost btn-square">
                <DotsVerticalIcon className="w-6 h-6 stroke-current" />
              </Button>
            </div>
          </Alert>
        </Wrapper>

        <Divider className="my-6" />

        <ClassTable data={data} />
      </div>
    </main>
  );
}

export default AlertPage;
