import React, { useState } from 'react';
import { withLayout } from '@layout/hoc';
import { PlusCircleIcon } from '@heroicons/react/outline';
import Tree from '@classroom/components/pages/tree/treeAdmin';
import TemplatePanel from '@classroom/components/pages/tree/templatePanel';
import EditLevel from '@classroom/components/pages/tree/editLevel';
import { PageHeader, Button } from 'leemons-ui';

function PageHeaderPage() {
  const [showEdit, toggleShowEdit] = useState(false);
  const toggleView = () => toggleShowEdit((value) => !value);
  return (
    <>
      <div className="bg-secondary-content  edit-mode w-full h-screen overflow-auto grid">
        <div className="bg-primary-content w-full">
          <PageHeader separator={false} title="Tree" className="pb-0"></PageHeader>
          <p className="page-description text-secondary pb-12 max-w-screen-xl w-full mx-auto px-6">
            Use the button{' '}
            <PlusCircleIcon alt="add button" className={`w-5 h-5 inline text-primary `} /> to create
            a new level, the use the config area to configure the data set for the level
          </p>
        </div>
        <div className="flex max-w-screen-xl w-full mx-auto px-6">
          <Button onClick={toggleView}>Toggle</Button>
          <Tree />
          {showEdit ? <EditLevel /> : <TemplatePanel />}
        </div>
      </div>
    </>
  );
}

export default withLayout(PageHeaderPage);
