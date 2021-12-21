import React, { useState } from 'react';
import { values } from 'lodash';
import PropTypes from 'prop-types';
import { Box, Title, Group, TextInput, Select, Button, Table } from '@bubbles-ui/components';
import BranchBlock from './BranchBlock';
import {
  BRANCH_CONTENT_ERROR_MESSAGES,
  BRANCH_CONTENT_MESSAGES,
  BRANCH_CONTENT_SELECT_DATA,
} from './branchContentDefaultValues';

function BranchContent({ messages, errorMessages, selectData, branch, isLoading, onSaveBlock }) {
  const [addBlock, setAddBlock] = useState(false);

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

  return (
    <Box m={32}>
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
          {values(branch.schema.jsonSchema.properties).map((item) => (
            <tr key={item.id}>
              <td>{item.frontConfig.name}</td>
              <td>{item.frontConfig.type}</td>
              <td></td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </Table>
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
