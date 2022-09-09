import React, { useMemo, useState } from 'react';
import { compact, keys, values } from 'lodash';
import PropTypes from 'prop-types';
import { AddCircleIcon, EditIcon, RatingStarIcon, RemoveIcon } from '@bubbles-ui/icons/outline';
import { ActionButton, Box, Button, ContextContainer, Stack, Table } from '@bubbles-ui/components';
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
  const [addBlock, setAddBlock] = useState(!branch.schema);
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
            name: (
              <>
                {item?.frontConfig?.blockData?.evaluationCriteria ? (
                  <Box sx={(theme) => ({ marginRight: theme.spacing[2] })}>
                    <RatingStarIcon />
                  </Box>
                ) : null}
                {item.frontConfig.name}
              </>
            ),
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

  React.useEffect(() => {
    setAddBlock(!branch.schema);
  }, [branch]);

  if (!branch) return 'Branch required';

  return (
    <ContextContainer>
      {branch.schema ? <Table columns={columns} data={data} /> : null}

      {addBlock || editingBlock ? (
        <>
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
  onSaveBlock: PropTypes.func,
  onCloseBranch: PropTypes.func,
  onRemoveBlock: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default BranchContent;
