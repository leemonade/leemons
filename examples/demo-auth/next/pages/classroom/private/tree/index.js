import React, { useState } from 'react';
import { withLayout } from '@layout/hoc';
import { PlusCircleIcon } from '@heroicons/react/outline';
import Tree from '@classroom/components/wip-dev/pages/tree/treeAdmin';
import TemplatePanel from '@classroom/components/wip-dev/pages/tree/templatePanel';
import EditLevel from '@classroom/components/wip-dev/pages/tree/editLevel';
import { PageHeader, Button, Modal, useModal } from 'leemons-ui';
import { useSession } from '@users/session';
import { goLoginPage } from '@users/navigate';
import tLoader from '@multilanguage/helpers/tLoader';
import useTranslate from '@multilanguage/useTranslate';

function TreePage() {
  const session = useSession({ redirectTo: goLoginPage });
  const [showEdit, toggleShowEdit] = useState({ active: false });
  const [showDelete, setShowDelete] = useState({ active: false });
  const [updateEntities, setUpdateEntities] = useState(null);
  const [translations] = useTranslate({
    keysStartsWith: ['plugins.classroom.tree_page', 'plugins.classroom.delete_modal'],
  });
  const t = tLoader('plugins.classroom.tree_page', translations);
  const tdm = tLoader('plugins.classroom.delete_modal', translations);
  const [modal, toggleModal] = useModal({
    animated: true,
    title: tdm('title'),
    message: tdm('message'),
    cancelLabel: tdm('actions.cancel'),
    actionLabel: tdm('actions.accept'),
    onAction: () => {
      if (showEdit.active && showEdit.entity.id === showDelete.entity.id) {
        toggleShowEdit({ active: false });
      }

      leemons
        .api(
          { url: `classroom/levelschema/${showDelete.entity.id}`, allAgents: true },
          { method: 'DELETE' }
        )
        .then(updateEntities.update);
      // TODO: Show alert
    },
  });
  const toggleDelete = (entity) => {
    if (!entity) {
      setShowDelete({ active: false });
      if (modal.isShown) {
        toggleModal();
      }
    } else {
      setShowDelete({ active: true, entity });
      toggleModal();
    }
  };
  return (
    <>
      <Modal {...modal} />
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
            onDelete={toggleDelete}
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
              onClose={() => toggleShowEdit({ active: false })}
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
