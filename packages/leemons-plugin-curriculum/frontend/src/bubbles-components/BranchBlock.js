import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import { Box, Button, ContextContainer, Group, Select, TextInput } from '@bubbles-ui/components';
import BranchBlockField from './BranchBlockField';
import {
  BRANCH_CONTENT_ERROR_MESSAGES,
  BRANCH_CONTENT_MESSAGES,
  BRANCH_CONTENT_SELECT_DATA,
} from './branchContentDefaultValues';
import BranchBlockCode from './BranchBlockCode';
import BranchBlockList from './BranchBlockList';
import BranchBlockGroup from './BranchBlockGroup';

function BranchBlock({
  messages,
  errorMessages,
  isLoading,
  selectData,
  defaultValues,
  onSubmit,
  onCancel,
}) {
  const form = useForm({ defaultValues });

  const {
    watch,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;

  React.useEffect(() => {
    reset(defaultValues);
  }, [JSON.stringify(defaultValues)]);

  const formData = watch();

  useEffect(() => {
    const subscription = watch(({ name, type }, { name: n }) => {
      if (n === 'type') {
        reset({ name, type });
      }
    });
    return () => subscription.unsubscribe();
  });

  const groupFields = [
    <Box key="item-1">
      <Controller
        name="name"
        control={control}
        rules={{
          required: errorMessages.blockNameRequired,
        }}
        render={({ field }) => (
          <TextInput
            label={messages.blockNameLabel}
            placeholder={messages.blockNamePlaceholder}
            error={errors.name}
            required
            {...field}
          />
        )}
      />
    </Box>,
    <Box key="item-2">
      <Controller
        name="type"
        control={control}
        rules={{
          required: errorMessages.blockTypeRequired,
        }}
        render={({ field }) => (
          <Select
            label={messages.blockTypeLabel}
            placeholder={messages.blockTypePlaceholder}
            required
            error={errors.type}
            data={selectData.blockType || []}
            nothingFound={messages.blockTypeNothingFound}
            {...field}
          />
        )}
      />
    </Box>,
  ];

  if (formData.type === 'code') {
    groupFields.push(
      <Box key="item-3">
        <Controller
          name="codeType"
          control={control}
          rules={{
            required: errorMessages.codeTypeRequired,
          }}
          render={({ field }) => (
            <Select
              label="&nbsp;"
              placeholder={messages.codeTypePlaceholder}
              required
              error={errors.codeType}
              data={selectData.codeType || []}
              nothingFound={messages.codeTypeNothingFound}
              {...field}
            />
          )}
        />
      </Box>
    );
  } else if (formData.type === 'list') {
    groupFields.push(
      <Box key="item-3">
        <Controller
          name="listType"
          control={control}
          rules={{
            required: errorMessages.listTypeRequired,
          }}
          render={({ field }) => (
            <Select
              label="&nbsp;"
              placeholder={messages.listTypePlaceholder}
              required
              error={errors.listType}
              data={selectData.listType || []}
              {...field}
            />
          )}
        />
      </Box>
    );
    groupFields.push(
      <Box key="item-4">
        <Controller
          name="listOrdered"
          control={control}
          rules={{
            required: errorMessages.listOrderedRequired,
          }}
          render={({ field }) => (
            <Select
              label="&nbsp;"
              placeholder={messages.listOrderedPlaceholder}
              required
              error={errors.listOrdered}
              data={selectData.listOrdered || []}
              {...field}
            />
          )}
        />
      </Box>
    );
  } else if (formData.type === 'group') {
    groupFields.push(
      <Box key="item-3">
        <Controller
          name="groupOrdered"
          control={control}
          rules={{
            required: errorMessages.groupOrderedRequired,
          }}
          render={({ field }) => (
            <Select
              label="&nbsp;"
              placeholder={messages.groupOrderedPlaceholder}
              required
              error={errors.groupOrdered}
              data={selectData.groupOrdered || []}
              {...field}
            />
          )}
        />
      </Box>
    );
  }

  const branchBlocks = {
    field: <BranchBlockField messages={messages} errorMessages={errorMessages} form={form} />,
    code: (
      <BranchBlockCode
        messages={messages}
        errorMessages={errorMessages}
        isLoading={isLoading}
        selectData={selectData}
        form={form}
      />
    ),
    list: (
      <BranchBlockList
        messages={messages}
        errorMessages={errorMessages}
        isLoading={isLoading}
        selectData={selectData}
        form={form}
      />
    ),
    group: (
      <BranchBlockGroup
        messages={messages}
        errorMessages={errorMessages}
        isLoading={isLoading}
        selectData={selectData}
        form={form}
      />
    ),
  };

  return (
    <form
      onSubmit={handleSubmit((data) => {
        const d = { ...data };
        if (defaultValues) d.id = defaultValues.id;
        onSubmit(d);
      })}
    >
      <ContextContainer>
        <Group grow>{groupFields}</Group>
        {branchBlocks[formData.type] || null}
        <ContextContainer direction="row" justifyContent="end">
          <Button variant="link" loading={isLoading} onClick={onCancel}>
            {messages.blockCancelConfigButtonLabel}
          </Button>
          <Button loading={isLoading} type="submit">
            {messages.blockSaveConfigButtonLabel}
          </Button>
        </ContextContainer>
      </ContextContainer>
    </form>
  );
}

BranchBlock.defaultProps = {
  messages: BRANCH_CONTENT_MESSAGES,
  errorMessages: BRANCH_CONTENT_ERROR_MESSAGES,
  selectData: BRANCH_CONTENT_SELECT_DATA,
  isLoading: false,
  onSubmit: () => {},
  onCancel: () => {},
};

BranchBlock.propTypes = {
  messages: PropTypes.object,
  errorMessages: PropTypes.object,
  selectData: PropTypes.object.isRequired,
  defaultValues: PropTypes.object,
  isLoading: PropTypes.bool,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};

export default BranchBlock;
