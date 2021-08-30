import React from 'react';
import { Divider } from '../../src/components/ui';
import ClassTable from '../../src/components/ClassTable';
import Wrapper from '../../src/components/Wrapper';
import PageHeader from '../../src/components/ui/PageHeader';

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
    <main>
      <h2 className="mt-2 mb-6 text-5xl font-bold">
        <span className="text-primary">Page header</span>
      </h2>
      <div className="flex-grow p-4">
        <div className="text-xl font-bold">Examples</div>

        <Wrapper title="alert" className="flex flex-col space-y-2">
          <PageHeader
            breadcrumbs={['Users', 'Profiles', 'Dataset']}
            title="This is a page title"
            titlePlaceholder="Add a title"
            canEditTitle={true}
            newButton={true}
            saveButton={true}
            cancelButton={true}
            duplicateButton={true}
            editButton={true}
          />
        </Wrapper>

        <Divider className="my-6" />

        <ClassTable data={data} />
      </div>
    </main>
  );
}

export default PageHeaderPage;
