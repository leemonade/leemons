import React, { useMemo, useState } from 'react';
import { compact, keys, values } from 'lodash';
import PropTypes from 'prop-types';
import { EditIcon, RemoveIcon } from '@bubbles-ui/icons/outline';
import {
  ActionButton,
  Button,
  ContextContainer,
  Stack,
  Table,
  Title,
} from '@bubbles-ui/components';
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
  onCloseBranch,
  onRemoveBlock,
}) {
  const [addBlock, setAddBlock] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);

  const columns = useMemo(
    () => [
      {
        Header: messages.blockNameLabel,
        accessor: 'name',
      },
      {
        Header: messages.blockTypeLabel,
        accessor: 'type',
      },
      {
        Header: messages.blockOrderedLabel,
        accessor: 'ordered',
      },
      {
        Header: '',
        accessor: 'actions',
      },
    ],
    [messages]
  );

  const data = useMemo(
    () =>
      compact(
        values(branch?.schema?.jsonSchema.properties || []).map((item, index) => {
          if (editingBlock && editingBlock.id === item.id) return null;
          return {
            name: item.frontConfig.name,
            type: item.frontConfig.groupType,
            ordered: item.frontConfig.groupOrdered ? item.frontConfig.groupOrdered : '-',
            actions: (
              <Stack justifyContent="end" fullWidth>
                <ActionButton
                  icon={<EditIcon />}
                  onClick={() =>
                    setEditingBlock({
                      ...item,
                      id: keys(branch.schema.jsonSchema.properties)[index],
                    })
                  }
                />
                <ActionButton
                  icon={<RemoveIcon />}
                  onClick={() =>
                    onRemoveBlock({
                      ...item,
                      id: keys(branch.schema.jsonSchema.properties)[index],
                    })
                  }
                />
              </Stack>
            ),
          };
        })
      ),
    [JSON.stringify(branch?.schema?.jsonSchema.properties), JSON.stringify(editingBlock)]
  );

  async function sendOnSaveBlock(block) {
    await onSaveBlock(block);
    setEditingBlock(null);
    setAddBlock(false);
  }

  if (!branch) return 'Branch required';

  return (
    <ContextContainer>
      <Stack fullWidth justifyContent="space-between" alignItems="center">
        <Title order={4}>{branch.name}</Title>
        <ActionButton icon={<RemoveIcon />} onClick={onCloseBranch} />
      </Stack>

      {branch.schema ? <Table columns={columns} data={data} /> : null}

      {addBlock || editingBlock ? (
        <BranchBlock
          messages={messages}
          errorMessages={errorMessages}
          selectData={selectData}
          isLoading={isLoading}
          branch={branch}
          defaultValues={
            editingBlock ? { ...editingBlock.frontConfig.blockData, id: editingBlock.id } : null
          }
          onCancel={() => {
            setEditingBlock(null);
            setAddBlock(false);
          }}
          onSubmit={sendOnSaveBlock}
        />
      ) : null}
      {!editingBlock && !addBlock ? (
        <Stack justifyContent="end">
          <Button onClick={() => setAddBlock(true)}>{messages.addContent}</Button>
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
  onSaveBlock: PropTypes.func,
  onCloseBranch: PropTypes.func,
  onRemoveBlock: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default BranchContent;
