import React, { useState } from 'react';
import { withLayout } from '@layout/hoc';
import { PlusCircleIcon } from '@heroicons/react/outline';
import Tree from '@classroom/components/wip-dev/pages/tree/treeAdmin';
import TemplatePanel from '@classroom/components/wip-dev/pages/tree/templatePanel';
import EditLevel from '@classroom/components/wip-dev/pages/tree/editLevel';
import { PageHeader, Button } from 'leemons-ui';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';
import tLoader from '@multilanguage/helpers/tLoader';
import useTranslate from '@multilanguage/useTranslate';

function TreePage() {
  const session = useSession({ redirectTo: goLoginPage });
  const [showEdit, toggleShowEdit] = useState({ active: false });
  const [updateEntities, setUpdateEntities] = useState(null);
  const toggleView = () => toggleShowEdit(({ active }) => ({ active: !active }));
  const [translations] = useTranslate({ keysStartsWith: 'plugins.classroom.tree_page' });
  const t = tLoader('plugins.classroom.tree_page', translations);
  return (
    <>
      <div className="bg-secondary-content  edit-mode w-full h-screen overflow-auto grid">
        <div className="bg-primary-content w-full">
          <PageHeader separator={false} title={t('page_title')} className="pb-0"></PageHeader>
          <p className="page-description text-secondary pb-12 max-w-screen-xl w-full mx-auto px-6">
            {t('page_info.pre')}{' '}
            <PlusCircleIcon alt="add button" className={`w-5 h-5 inline text-primary `} />{' '}
            {t('page_info.post')}
          </p>
        </div>
        <div className="flex max-w-screen-xl w-full mx-auto px-6">
          {/* LevelSchemas tree */}
          <Tree
            editingEntity={showEdit}
            locale={session?.locale}
            setUpdate={(update) => setUpdateEntities({ update })}
            onDetails={console.log}
            onEdit={(entity) => {
              if (entity !== showEdit.entity) {
                toggleShowEdit({ active: true, entity, parent: entity.parent });
              }
            }}
            onAdd={(parent) => {
              if (showEdit.parent !== parent || showEdit.entity) {
                toggleShowEdit({ active: true, entity: null, parent });
              }
            }}
          />
          {showEdit.active ? (
            // Edit LevelSchema form
            <EditLevel
              locale={session?.locale}
              entity={showEdit.entity}
              setEntity={(state) => toggleShowEdit({ active: showEdit.active, ...state })}
              parent={showEdit.parent}
              onUpdate={() => {
                updateEntities.update();
              }}
            />
          ) : (
            // Show templates panel
            <TemplatePanel />
          )}
        </div>
      </div>
    </>
  );
}

export default withLayout(TreePage);
