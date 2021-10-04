import React, { useState } from 'react';
import { withLayout } from '@layout/hoc';
import { InformationCircleIcon } from '@heroicons/react/solid';
import Tree from '@subjects/components/pages/tree/treeAdmin';
import TemplatePanel from '@subjects/components/pages/tree/templatePanel';
import EditLevel from '@subjects/components/pages/tree/editLevel';
import { PageHeader, Button, Modal, useModal, InlineSvg } from 'leemons-ui';
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
    keysStartsWith: ['plugins.subjects.tree_page', 'plugins.subjects.delete_modal'],
  });
  const t = tLoader('plugins.subjects.tree_page', translations);
  const tdm = tLoader('plugins.subjects.delete_modal', translations);
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
          { url: `subjects/levelschema/${showDelete.entity.id}`, allAgents: true },
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
      <div className="flex h-full">
        <div className="w-4/12 flex justify-end bg-white">
          <div style={{ maxWidth: 500 }} className="flex flex-col p-12">
            {/* TITLE HEAD */}
            <div className="flex">
              <div className="relative w-5 h-5">
                <InlineSvg src="/subjects/plugin-icon.svg" className="text-gray" />
              </div>
              <div className="flex flex-col ml-2">
                <div>{t('page_title')}</div>
                <div className="text-lg font-normal leading-none">{t('page_subtitle')}</div>
              </div>
            </div>
            {/* TREE */}
            <div className="flex flex-1">
              {/* LevelSchemas tree */}
              <div className="shadow-xl self-start w-full rounded border border-gray-30 my-6 p-1">
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
                  className="w-full"
                />
              </div>
            </div>
            {/* FOOTER */}
            <div className="flex flex-col font-inter gap-2">
              <div>
                <InformationCircleIcon className="inline-block stroke-current w-6 h-6" />
              </div>
              <div className="font-normal">{t('page_info.pre')}</div>
              <div className="text-gray-300 text-sm">{t('page_info.post')}</div>
            </div>
          </div>
        </div>
        <div
          className={`w-8/12 ${
            showEdit.active ? 'bg-white' : 'bg-gray-10'
          } border-l border-gray-20`}
        >
          <div style={{ maxWidth: 1000 }} className="flex flex-1 h-full">
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
              <div className="p-12 max-w-sm">
                <TemplatePanel />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default withLayout(TreePage);
