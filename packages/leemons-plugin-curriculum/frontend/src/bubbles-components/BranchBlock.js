import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Controller, useForm } from 'react-hook-form';
import {
  ActionButton,
  Box,
  Button,
  ContextContainer,
  createStyles,
  NumberInput,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
} from '@bubbles-ui/components';
import { EditorListBulletsIcon } from '@bubbles-ui/icons/solid';
import { RemoveIcon } from '@bubbles-ui/icons/outline';
import BranchBlockListCustomOrder from '@curriculum/bubbles-components/BranchBlockListCustomOrder';
import {
  BRANCH_CONTENT_ERROR_MESSAGES,
  BRANCH_CONTENT_MESSAGES,
  BRANCH_CONTENT_SELECT_DATA,
} from './branchContentDefaultValues';
import BranchBlockCode from './BranchBlockCode';
import BranchBlockGroup from './BranchBlockGroup';

const useStyle = createStyles((theme) => ({
  container: {
    border: `1px solid ${theme.colors.ui01}`,
    borderRadius: '8px',
    padding: `${theme.spacing[4]}px ${theme.spacing[5]}px`,
    position: 'relative',
  },
  header: {
    paddingBottom: theme.spacing[6],
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    height: 18,
    width: 18,
    marginRight: theme.spacing[2],
  },
  close: {
    position: 'absolute',
    right: theme.spacing[2],
    top: theme.spacing[2],
  },
}));

function BranchBlock({
  messages,
  errorMessages,
  isLoading,
  selectData,
  defaultValues,
  onSubmit,
  hasProperties,
  onCancel,
  onRemove,
}) {
  const { classes } = useStyle();
  const isNew = !defaultValues;
  const form = useForm({ defaultValues });

  const {
    getValues,
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
    const subscription = watch(({ curricularContent, name, type }, { name: n }) => {
      if (n === 'type') {
        reset({ curricularContent, name, type });
      }
    });
    return () => subscription.unsubscribe();
  });

  const nameController = (
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
  );

  const curricularContentController = (
    <Controller
      name="curricularContent"
      control={control}
      rules={{
        required: errorMessages.curricularContentRequired,
      }}
      render={({ field }) => (
        <Select
          label={messages.curricularContentLabel}
          placeholder={messages.curricularContentPlaceholder}
          error={errors.curricularContent}
          required
          data={[
            { label: messages.curricularKnowledges, value: 'knowledges' },
            { label: messages.curricularQualifyingCriteria, value: 'qualifying-criteria' },
            { label: messages.curricularNonQualifyingCriteria, value: 'non-qualifying-criteria' },
          ]}
          {...field}
        />
      )}
    />
  );

  const typeController = (
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
  );

  const maxController = (
    <Controller
      name="max"
      control={control}
      shouldUnregister
      rules={
        {
          // required: errorMessages.fieldMaxRequired,
        }
      }
      render={({ field }) => (
        <NumberInput
          label={messages.fieldMaxLabel}
          placeholder={messages.fieldMaxPlaceholder}
          error={errors.max?.message}
          // required
          {...field}
        />
      )}
    />
  );

  const groupFields = [];

  if (formData.type === 'field' || formData.type === 'textarea') {
    /*
    groupFields.push(
      <Controller
        name="min"
        control={control}
        shouldUnregister
        rules={
          {
            required: errorMessages.fieldMinRequired,
          }
        }
        render={({ field }) => (
          <NumberInput
            label={messages.fieldMinLabel}
            placeholder={messages.fieldMinPlaceholder}
            error={errors.min?.message}
            required
            {...field}
          />
        )}
      />
    );

     */
    groupFields.push(maxController);
  } else if (formData.type === 'code') {
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
              label={messages.subTypeLabel}
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
    groupFields.push(maxController);
  } /* else if (formData.type === 'group') {
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
              label={messages.numerationLabel}
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
  } */

  const listOrderedController = (
    <Controller
      name="listOrdered"
      control={control}
      shouldUnregister
      rules={
        {
          // required: errorMessages.listOrderedRequired,
        }
      }
      render={({ field }) => (
        <Select
          label={messages.numerationLabel}
          placeholder={messages.listOrderedPlaceholder}
          // required
          error={errors.listOrdered}
          data={selectData.listOrdered || []}
          {...field}
        />
      )}
    />
  );

  const listOrdered = (
    <>
      <Controller
        name="useListOrdered"
        control={control}
        shouldUnregister
        render={({ field }) => (
          <Switch label={messages.useNumerationLabel} checked={field.value} {...field} />
        )}
      />
      {formData.useListOrdered ? (
        <Stack fullWidth spacing={2}>
          <Box>{listOrderedController}</Box>
          <Box>
            {formData.listOrdered === 'custom' ? (
              <BranchBlockListCustomOrder
                messages={messages}
                errorMessages={errorMessages}
                isLoading={isLoading}
                selectData={selectData}
                form={form}
              />
            ) : null}
          </Box>
        </Stack>
      ) : null}
    </>
  );

  const branchBlocks = {
    code: (
      <BranchBlockCode
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
      autoComplete="off"
    >
      <Box className={classes.container}>
        {hasProperties ? (
          <ActionButton className={classes.close} icon={<RemoveIcon />} onClick={onCancel} />
        ) : null}
        <Box className={classes.header}>
          <EditorListBulletsIcon className={classes.icon} />
          <Text size="md" color="primary" role="productive" stronger>
            {isNew ? messages.newBlock : formData.name}
          </Text>
        </Box>
        <ContextContainer>
          <Stack fullWidth spacing={2}>
            <Box>{nameController}</Box>
            <Box />
          </Stack>
          <Stack fullWidth spacing={2}>
            <Stack fullWidth spacing={2}>
              {curricularContentController}
              {typeController}
            </Stack>
            <Stack fullWidth spacing={2}>
              {groupFields}
            </Stack>
          </Stack>

          {formData.type === 'list' ? listOrdered : null}

          {branchBlocks[formData.type] || null}

          <ContextContainer direction="row" justifyContent="space-between">
            {!isNew && hasProperties ? (
              <Button variant="link" loading={isLoading} onClick={onRemove}>
                {messages.removeBlock}
              </Button>
            ) : null}
            {isNew && hasProperties ? (
              <Button variant="link" loading={isLoading} onClick={onCancel}>
                {messages.blockCancelConfigButtonLabel}
              </Button>
            ) : null}

            <Button variant="outline" loading={isLoading} type="submit">
              {messages.blockSaveConfigButtonLabel}
            </Button>
          </ContextContainer>
        </ContextContainer>
      </Box>
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
  onRemove: () => {},
};

BranchBlock.propTypes = {
  messages: PropTypes.object,
  errorMessages: PropTypes.object,
  selectData: PropTypes.object.isRequired,
  defaultValues: PropTypes.object,
  isLoading: PropTypes.bool,
  onSubmit: PropTypes.func,
  hasProperties: PropTypes.bool,
  onCancel: PropTypes.func,
  onRemove: PropTypes.func,
};

export default BranchBlock;
