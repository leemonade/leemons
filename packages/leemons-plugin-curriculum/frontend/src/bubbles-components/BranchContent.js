import { Button, ContextContainer, Stack } from '@bubbles-ui/components';
import { AddCircleIcon } from '@bubbles-ui/icons/outline';
import BranchBlockPreview from '@curriculum/bubbles-components/BranchBlockPreview';
import { values } from 'lodash';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import BranchBlock from './BranchBlock';
import {
  BRANCH_CONTENT_ERROR_MESSAGES,
  BRANCH_CONTENT_MESSAGES,
  BRANCH_CONTENT_SELECT_DATA,
} from './branchContentDefaultValues';

function BranchContent({
  messages,
  errorMessages,
  selectData,
  branch,
  isLoading,
  onSaveBlock,
  onlyCanAdd,
  newIds,
  onCloseBranch,
  onRemoveBlock,
  store,
}) {
  const properties = values(branch?.schema?.jsonSchema.properties) || [];
  const [addBlock, setAddBlock] = useState(!properties.length);
  const [editingBlock, setEditingBlock] = useState(null);

  async function sendOnSaveBlock(block) {
    await onSaveBlock(block);
    setEditingBlock(null);
    setAddBlock(false);
  }

  async function onRemoveBlock2() {
    await onRemoveBlock(editingBlock);
    setEditingBlock(null);
    setAddBlock(false);
  }

  React.useEffect(() => {
    setAddBlock(!properties.length);
    setEditingBlock(null);
  }, [branch]);

  if (!branch) return 'Branch required';

  return (
    <ContextContainer>
      {properties.length
        ? properties.map((item) => {
            if (editingBlock?.id == item.id) {
              return (
                <BranchBlock
                  messages={messages}
                  errorMessages={errorMessages}
                  selectData={selectData}
                  isLoading={isLoading}
                  hasProperties={!!properties.length}
                  branch={branch}
                  store={store}
                  defaultValues={
                    editingBlock
                      ? { ...editingBlock.frontConfig.blockData, id: editingBlock.id }
                      : null
                  }
                  onCancel={() => {
                    setEditingBlock(null);
                    setAddBlock(false);
                  }}
                  onRemove={onRemoveBlock2}
                  onSubmit={sendOnSaveBlock}
                />
              );
            }
            return (
              <BranchBlockPreview
                key={JSON.stringify(item)}
                selectData={selectData}
                messages={messages}
                onlyCanAdd={newIds.includes(item.id) ? false : onlyCanAdd}
                item={item}
                onEdit={() => {
                  setEditingBlock(item);
                  setAddBlock(false);
                }}
              />
            );
          })
        : null}

      {addBlock ? (
        <>
          <BranchBlock
            messages={messages}
            errorMessages={errorMessages}
            selectData={selectData}
            isLoading={isLoading}
            hasProperties={!!properties.length}
            branch={branch}
            store={store}
            defaultValues={
              editingBlock ? { ...editingBlock.frontConfig.blockData, id: editingBlock.id } : null
            }
            onCancel={() => {
              setEditingBlock(null);
              setAddBlock(false);
            }}
            onRemove={onRemoveBlock2}
            onSubmit={sendOnSaveBlock}
          />
        </>
      ) : null}
      {!editingBlock && !addBlock ? (
        <Stack justifyContent="end">
          <Button variant="light" leftIcon={<AddCircleIcon />} onClick={() => setAddBlock(true)}>
            {messages.addContent}
          </Button>
        </Stack>
      ) : null}
    </ContextContainer>
  );
}

BranchContent.defaultProps = {
  messages: BRANCH_CONTENT_MESSAGES,
  errorMessages: BRANCH_CONTENT_ERROR_MESSAGES,
  selectData: BRANCH_CONTENT_SELECT_DATA,
  onSaveBlock: () => {},
  onCloseBranch: () => {},
  onRemoveBlock: () => {},
  isLoading: false,
};

BranchContent.propTypes = {
  messages: PropTypes.object,
  errorMessages: PropTypes.object,
  selectData: PropTypes.object,
  branch: PropTypes.object,
  newIds: PropTypes.any,
  onSaveBlock: PropTypes.func,
  onCloseBranch: PropTypes.func,
  onRemoveBlock: PropTypes.func,
  isLoading: PropTypes.bool,
  store: PropTypes.any,
};

export default BranchContent;
