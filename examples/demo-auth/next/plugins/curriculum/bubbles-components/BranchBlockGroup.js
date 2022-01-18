import React, { useState } from 'react';
import { keyBy } from 'lodash';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { Box, Select, Group, Button, TagifyInput, Input } from '@bubbles-ui/components';
import { EditIcon, RemoveIcon } from '@bubbles-ui/icons/outline';
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
    <Box>
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
    </Box>
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

export default BranchBlockGroup;
