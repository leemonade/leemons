import React, { useState, useMemo } from 'react';
import { values, keys, compact } from 'lodash';
import PropTypes from 'prop-types';
import {
  Box,
  Title,
  Group,
  TextInput,
  Select,
  Button,
  Table,
  Stack,
  ActionButton,
} from '@bubbles-ui/components';
import { EditIcon, RemoveIcon } from '@bubbles-ui/icons/outline';
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
  onRemoveBlock,
}) {
  const [addBlock, setAddBlock] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);

  if (!branch) return 'Branch required';

  if (!branch.schema) {
    if (addBlock) {
      return (
        <BranchBlock
          messages={messages}
          errorMessages={errorMessages}
          selectData={selectData}
          isLoading={isLoading}
          branch={branch}
          onSubmit={onSaveBlock}
        />
      );
    }
    return (
      <Button variant="link" onClick={() => setAddBlock(true)}>
        {messages.addContent}
      </Button>
    );
  }

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
        values(branch.schema.jsonSchema.properties).map((item, index) => {
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
    [branch.schema.jsonSchema.properties]
  );

  return (
    <Box m={32}>
      <Table columns={columns} data={data} />
      {/*
      <Table>
        <thead>
          <tr>
            <th>{messages.blockNameLabel}</th>
            <th>{messages.blockTypeLabel}</th>
            <th>{messages.blockOrderedLabel}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {values(branch.schema.jsonSchema.properties).map((item, index) => {
            if (editingBlock && editingBlock.id === item.id) return null;
            return (
              <tr key={index}>
                <td>{item.frontConfig.name}</td>
                <td>{item.frontConfig.groupType}</td>
                <td>{item.frontConfig.groupOrdered ? item.frontConfig.groupOrdered : '-'}</td>
                <td>
                  <Group>
                    <EditIcon
                      onClick={() =>
                        setEditingBlock({
                          ...item,
                          id: keys(branch.schema.jsonSchema.properties)[index],
                        })
                      }
                    />
                    <RemoveIcon
                      onClick={() =>
                        onRemoveBlock({
                          ...item,
                          id: keys(branch.schema.jsonSchema.properties)[index],
                        })
                      }
                    />
                  </Group>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      */}
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
          onSubmit={onSaveBlock}
        />
      ) : null}
      <Button variant="link" onClick={() => setAddBlock(true)}>
        {messages.addContent}
      </Button>
    </Box>
  );
}

BranchContent.defaultProps = {
  messages: BRANCH_CONTENT_MESSAGES,
  errorMessages: BRANCH_CONTENT_ERROR_MESSAGES,
  selectData: BRANCH_CONTENT_SELECT_DATA,
  onSaveBlock: () => {},
  isLoading: false,
};

BranchContent.propTypes = {
  messages: PropTypes.object,
  errorMessages: PropTypes.object,
  selectData: PropTypes.object,
  branch: PropTypes.object,
  onSaveBlock: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default BranchContent;
