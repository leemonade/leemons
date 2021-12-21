import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import { Box, Title, Group, TextInput, Select, Button } from '@bubbles-ui/components';
import BranchBlock from './BranchBlock';

export const BRANCH_CONTENT_MESSAGES = {
  addContent: 'Add Content',
};

export const BRANCH_CONTENT_ERROR_MESSAGES = {
  nameRequired: 'Field required',
  orderedRequired: 'Field required',
};

function BranchContent({ messages, errorMessages, branch, isLoading, onSaveBlock }) {
  const [addBlock, setAddBlock] = useState(false);

  const {
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  if (!branch) return 'Branch required';

  if (!branch.schema) {
    if (addBlock) {
      return (
        <BranchBlock
          // messages={messages}
          // errorMessages={errorMessages}
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

  // branch.schema.jsonSchema.properties
  return <Box m={32}></Box>;
}

BranchContent.defaultProps = {
  messages: BRANCH_CONTENT_MESSAGES,
  errorMessages: BRANCH_CONTENT_ERROR_MESSAGES,
  onSaveBlock: () => {},
  isLoading: false,
};

BranchContent.propTypes = {
  messages: PropTypes.object,
  errorMessages: PropTypes.object,
  branch: PropTypes.object,
  onSaveBlock: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default BranchContent;
