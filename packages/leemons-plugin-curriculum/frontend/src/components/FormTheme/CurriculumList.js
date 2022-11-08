/* eslint-disable no-param-reassign */
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Stack } from '@bubbles-ui/components';
import { ParentRelation } from '@curriculum/components/FormTheme/ParentRelation';
import { useStore } from '@common';
import { AddCircleIcon } from '@bubbles-ui/icons/outline';
import CurriculumListItem from '@curriculum/components/FormTheme/CurriculumListItem';

function CurriculumList({
  onChange,
  isEditMode = true,
  value,
  curriculum,
  schema,
  blockData,
  onSave,
  id,
  t,
}) {
  const [store, render] = useStore();

  async function save(e) {
    store.loading = true;
    render();
    await onSave(e);
    store.loading = false;
    render();
  }

  function onNew() {
    store.editingItem = null;
    store.isNewItem = true;
    render();
  }

  function onCancel() {
    store.editingItem = null;
    store.isNewItem = false;
    render();
  }

  function addNew(values) {
    store.isNewItem = false;
    onChange({ ...value, value: [...(value?.value || []), { ...values }] });
    setTimeout(() => {
      save(true);
    }, 100);
  }

  function onRemove(index) {
    value.value.splice(index, 1);
    onChange({ ...value });
    setTimeout(() => {
      save(true);
    }, 100);
  }

  function onUpdate(index, newValues) {
    store.editingItem = null;
    value.value[index] = newValues;
    onChange({ ...value });
    setTimeout(() => {
      save(true);
    }, 100);
  }

  function onEdit(index) {
    store.editingItem = { index };
    store.isNewItem = false;
    render();
  }

  return (
    <Box>
      <ParentRelation
        curriculum={curriculum}
        blockData={blockData}
        value={value}
        isEditMode={isEditMode}
        onChange={onChange}
        isShow={(e) => {
          store.showSaveButton = e;
          render();
        }}
        id={id}
        t={t}
      />

      {value?.value.map((item, index) => (
        <CurriculumListItem
          key={index}
          isEditMode={isEditMode}
          curriculum={curriculum}
          preview={!isEditMode ? true : store.editingItem?.index !== index}
          defaultValues={item}
          schema={schema}
          id={id}
          blockData={blockData}
          t={t}
          onEdit={() => {
            onEdit(index);
          }}
          onRemove={() => {
            onRemove(index);
          }}
          onSave={(e) => {
            onUpdate(index, e);
          }}
          onCancel={onCancel}
        />
      ))}

      {store.isNewItem && isEditMode ? (
        <CurriculumListItem
          schema={schema}
          curriculum={curriculum}
          blockData={blockData}
          t={t}
          id={id}
          onSave={addNew}
          onCancel={onCancel}
        />
      ) : null}
      {!store.editingItem && !store.isNewItem && isEditMode ? (
        <Stack justifyContent="space-between" fullWidth>
          <Box>
            <Button variant="light" leftIcon={<AddCircleIcon />} onClick={onNew}>
              {t('addNewElementToList')}
            </Button>
          </Box>
          {store.showSaveButton ? (
            <Box>
              <Button variant="outline" loading={store.loading} onClick={() => save()}>
                {t('save')}
              </Button>
            </Box>
          ) : (
            <Box />
          )}
        </Stack>
      ) : null}
    </Box>
  );
}

CurriculumList.defaultProps = {
  onSave: () => {},
};

CurriculumList.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.any,
  schema: PropTypes.any,
  isEditMode: PropTypes.bool,
  blockData: PropTypes.any,
  curriculum: PropTypes.any,
  onSave: PropTypes.func,
  id: PropTypes.string,
  t: PropTypes.func,
};

export default CurriculumList;
