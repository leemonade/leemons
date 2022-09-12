/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';
import { keyBy, map } from 'lodash';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import {
  Box,
  Button,
  ContextContainer,
  createStyles,
  Group,
  Input,
  InputWrapper,
  NumberInput,
  Select,
  Stack,
  TableInput,
  TagifyInput,
  TextInput,
  Title,
} from '@bubbles-ui/components';
import { EditIcon, RemoveIcon } from '@bubbles-ui/icons/outline';
import BranchBlockListCustomOrder from '@curriculum/bubbles-components/BranchBlockListCustomOrder';
import BranchBlockGroupColumn from './BranchBlockGroupColumn';

function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function BranchBlockGroup({ ...props }) {
  const [activeColumn, setActiveColumn] = useState(null);
  const [showAddColumn, setShowAddColumn] = useState(false);

  const {
    messages,
    errorMessages,
    selectData,
    form: {
      setValue,
      getValues,
      control,
      watch,
      unregister,
      formState: { errors },
    },
  } = props;

  const typesByValue = keyBy(selectData.groupTypeOfContents, 'value');

  function openModalColumn() {
    setActiveColumn(null);
    setShowAddColumn(true);
  }

  function editColumn(item) {
    setActiveColumn(item);
    setShowAddColumn(true);
  }

  function removeColumn(item) {
    const columns = getValues('columns');
    const index = columns.findIndex((c) => c.id === item.id);
    columns.splice(index, 1);
    setValue('columns', [...columns]);
  }

  function saveColumn(data) {
    if (data.id) {
      const columns = getValues('columns');
      const index = columns.findIndex((item) => item.id === data.id);
      columns[index] = data;
      setValue('columns', [...columns]);
    } else {
      setValue('columns', [...(getValues('columns') || []), { id: makeid(32), ...data }]);
    }
  }

  function saveConfig() {
    setValue('isConfig', true);
  }

  function addElement() {
    const elements = getValues('elements') || [];
    setValue('elements', [...elements, { id: makeid(32) }]);
  }

  function onChangeElementValue(e, index, itemId) {
    const elements = getValues('elements');
    elements[index][itemId] = e.target.value;
    setValue('elements', [...elements]);
  }

  const formColumns = watch('columns') || [];

  const whitelist = formColumns.map((item) => ({
    id: item.id,
    value: item.name,
  }));

  const isConfig = watch('isConfig');

  const elements = watch('elements') || [];

  if (isConfig) {
    return (
      <Box>
        <Group>
          {formColumns.map((item) => (
            <Box key={item.id}>{item.name}</Box>
          ))}
        </Group>
        {elements.map((element, i) => (
          <Group key={element.id}>
            {formColumns.map((item) => (
              <Input
                key={item.id}
                value={element[item.id]}
                onChange={(e) => onChangeElementValue(e, i, item.id)}
              />
            ))}
          </Group>
        ))}
        <Button onClick={addElement}>{messages.groupAddElement}</Button>
      </Box>
    );
  }
  return (
    <ContextContainer
      sx={(theme) => ({
        borderTop: `1px solid ${theme.colors.ui01}`,
        paddingTop: theme.spacing[4],
      })}
    >
      <Box></Box>
      <Box>
        <Controller
          name="groupTypeOfContents"
          control={control}
          rules={{
            required: errorMessages.groupOrderedRequired,
          }}
          render={({ field }) => (
            <Select
              label={messages.groupTypeOfContentLabel}
              placeholder={messages.groupTypeOfContentPLaceholder}
              required
              error={errors.groupTypeOfContents}
              data={selectData.groupTypeOfContents || []}
              {...field}
            />
          )}
        />
      </Box>
      <Box style={{ position: 'relative' }}>
        <Box>{messages.groupContentConfigLabel}</Box>
        {formColumns.map((item) => (
          <Box key={item.id}>
            {item.name}({typesByValue[item.type].label})
            <EditIcon onClick={() => editColumn(item)} />
            <RemoveIcon onClick={() => removeColumn(item)} />
          </Box>
        ))}
        <Button onClick={openModalColumn}>{messages.groupAddColumnButtonLabel}</Button>
        <BranchBlockGroupColumn
          {...props}
          setOpened={setShowAddColumn}
          opened={showAddColumn}
          onSave={saveColumn}
          defaultValues={activeColumn}
        />
      </Box>
      <Box>
        <Controller
          name="showAs"
          control={control}
          rules={{
            required: errorMessages.groupShowAsRequired,
          }}
          render={({ field }) => (
            <TagifyInput
              value={field.value}
              onChange={(e) => field.onChange(e.detail.value)}
              settings={{
                mode: 'mix',
                pattern: /@/,
                editTags: false,
                dropdown: {
                  enabled: 1,
                  position: 'text',
                },
                whitelist,
              }}
              whitelist={whitelist}
              label={messages.groupShowAs}
              required
            />
          )}
        />
      </Box>
      <Button onClick={saveConfig}>{messages.groupSaveConfig}</Button>
    </ContextContainer>
  );
}

BranchBlockGroup.propTypes = {
  messages: PropTypes.object,
  errorMessages: PropTypes.object,
  isLoading: PropTypes.bool,
  onSubmit: PropTypes.func,
  selectData: PropTypes.object,
  form: PropTypes.object,
};

const useStyle = createStyles((theme) => ({
  container: {
    borderTop: `1px solid ${theme.colors.ui01}`,
    paddingTop: theme.spacing[4],
  },
}));

function BranchBlockGroup2({ ...props }) {
  const { classes } = useStyle();
  const {
    messages,
    errorMessages,
    selectData,
    form: {
      setValue,
      getValues,
      control,
      watch,
      unregister,
      formState: { errors },
    },
  } = props;

  const groupListOrdered = watch('groupListOrdered');
  const groupTypeOfContents = watch('groupTypeOfContents');

  const columnsConfig = React.useMemo(
    () => ({
      resetOnAdd: true,
      editable: true,
      removable: true,
      sortable: false,
      labels: {
        add: messages.tableAdd,
        remove: messages.tableRemove,
        edit: messages.tableEdit,
        accept: messages.tableAccept,
        cancel: messages.tableCancel,
      },
      columns: [
        {
          Header: `${messages.fieldName} *`,
          accessor: 'name',
          input: {
            node: <TextInput />,
            rules: { required: errorMessages.fieldNameRequired },
          },
        },
        {
          Header: messages.fieldMaxLabel,
          accessor: 'max',
          input: {
            node: <NumberInput min={0} />,
          },
        },
      ],
      onChange: (e) => {
        setValue(
          'columns',
          map(e, (item) => ({
            ...item,
            type: 'field',
            id: item.id || makeid(32),
          }))
        );
      },
    }),
    []
  );

  const listTypeController = (
    <Controller
      name="groupListType"
      control={control}
      shouldUnregister
      rules={{
        required: errorMessages.listTypeRequired,
      }}
      render={({ field }) => (
        <Select
          label={messages.subTypeLabel}
          placeholder={messages.listTypePlaceholder}
          required
          error={errors.groupListType}
          data={selectData.listType || []}
          {...field}
        />
      )}
    />
  );
  const maxController = (
    <Controller
      name="groupMax"
      control={control}
      shouldUnregister
      render={({ field }) => (
        <NumberInput
          min={0}
          label={messages.fieldMaxLabel}
          placeholder={messages.fieldMaxPlaceholder}
          error={errors.groupMax?.message}
          {...field}
        />
      )}
    />
  );

  const listOrderedController = (
    <Controller
      name="groupListOrdered"
      control={control}
      shouldUnregister
      render={({ field }) => (
        <Select
          label={messages.numerationLabel}
          placeholder={messages.listOrderedPlaceholder}
          error={errors.groupListOrdered}
          data={selectData.listOrdered || []}
          {...field}
        />
      )}
    />
  );

  return (
    <ContextContainer className={classes.container}>
      <Box>
        <Title order={5} weight={500}>
          {messages.subBlockTitle}
        </Title>
        <Controller
          name="columns"
          control={control}
          rules={{
            required: errorMessages.groupShowAsRequired,
          }}
          render={({ field }) => (
            <InputWrapper error={errors.columns}>
              <TableInput {...field} data={field.value} {...columnsConfig} />
            </InputWrapper>
          )}
        />
      </Box>
      <Controller
        name="showAs"
        control={control}
        rules={{
          required: errorMessages.groupShowAsRequired,
        }}
        render={({ field }) => (
          <TagifyInput
            value={field.value}
            onChange={(e) => field.onChange(e.detail.value)}
            settings={{
              mode: 'mix',
              pattern: /@/,
              editTags: false,
            }}
            error={errors.showAs}
            label={messages.groupShowAs}
            required
          />
        )}
      />
      <Box>
        <Title order={5} weight={500}>
          {messages.subBlockContent}
        </Title>
        <Stack fullWidth spacing={2} sx={(theme) => ({ marginTop: theme.spacing[2] })}>
          <Box>
            <Controller
              name="groupTypeOfContents"
              control={control}
              rules={{
                required: errorMessages.groupOrderedRequired,
              }}
              render={({ field }) => (
                <Select
                  label={messages.groupTypeOfContentLabel}
                  placeholder={messages.groupTypeOfContentPLaceholder}
                  required
                  error={errors.groupTypeOfContents}
                  data={selectData.groupTypeOfContents || []}
                  {...field}
                />
              )}
            />
          </Box>
          <Box>
            {groupTypeOfContents === 'list'
              ? listTypeController
              : groupTypeOfContents
              ? maxController
              : null}
          </Box>
          <Box>{groupTypeOfContents === 'list' ? maxController : null}</Box>
          <Box>{groupTypeOfContents === 'list' ? listOrderedController : null}</Box>
        </Stack>
        {groupListOrdered === 'custom' ? (
          <Box sx={(theme) => ({ marginTop: theme.spacing[2] })}>
            <BranchBlockListCustomOrder
              messages={messages}
              errorMessages={errorMessages}
              isLoading={false}
              selectData={selectData}
              form={props.form}
              withPrevious={false}
            />
          </Box>
        ) : null}
      </Box>
    </ContextContainer>
  );
}

export default BranchBlockGroup;
