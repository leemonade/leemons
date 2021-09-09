import React from 'react';
import { FormControl, Input, PageContainer, PageHeader, Badge, Button, Table } from '../../../src/components/ui';
import { XIcon, SearchIcon } from '@heroicons/react/outline';


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

function PageHeaderPage() {
  return (
    <>
      <div className="bg-secondary-content w-full h-screen overflow-auto">
        <PageHeader
          separator={false}
          title="Families list"
          description="Families make it easy to manage the organization of parent and student groups"
          importFamiliesButton={true}
          newButton={true}
        />
        <div className="bg-primary-content w-full">
          <div className="max-w-screen-xl w-full mx-auto p-6">
            <h2 className="resultcount flex items-center" aria-live='polite'> <Badge outlined>250</Badge> <span className="text-xl font-medium">Families</span></h2>
          </div>
        </div>

        <PageContainer>
          <FormControl>

            <div className="relative">
              <Button className='btn-search' >
                <SearchIcon
                  className={`w-5 h-5 transition color-base-300 `}
                />
              </Button>

              <Input
                ghost={true}
                placeholder="Find a family"
                className="bg-transparent input-search"
              />
            </div>
          </FormControl>
        </PageContainer>
      </div>
    </>
  );
}

export default PageHeaderPage;
