/* eslint-disable no-param-reassign */
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Stack, TAGIFY_TAG_REGEX } from '@bubbles-ui/components';
import { ParentRelation } from '@curriculum/components/FormTheme/ParentRelation';
import { useStore } from '@common';
import { AddCircleIcon } from '@bubbles-ui/icons/outline';
import CurriculumListItem from '@curriculum/components/FormTheme/CurriculumListItem';
import { StartNumbering } from '@curriculum/components/FormTheme/StartNumbering';
import { getItemTitleNumberedWithParents } from '@curriculum/helpers/getItemTitleNumberedWithParents';

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

  function getTitle(values, index) {
    return getItemTitleNumberedWithParents(curriculum, blockData, id, values, index);
  }

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

  const customNumberingStyle = React.useMemo(() => {
    let result = null;
    if (blockData.listOrderedText) {
      let array;
      // eslint-disable-next-line no-cond-assign
      while ((array = TAGIFY_TAG_REGEX.exec(blockData.listOrderedText)) !== null) {
        const json = JSON.parse(array[0])[0][0];
        if (json.numberingStyle) {
          result = json;
        }
      }
    }
    return result;
  }, [blockData]);

  const useOrder = React.useMemo(() => {
    if (blockData.listOrdered === 'style-1') {
      return 'numbers';
    }
    if (blockData.listOrdered === 'style-2') {
      return 'vocals';
    }
    if (blockData.listOrdered === 'custom' && customNumberingStyle) {
      if (customNumberingStyle.numberingStyle === 'style-1') {
        return 'numbers';
      }
      if (customNumberingStyle.numberingStyle === 'style-2') {
        return 'vocals';
      }
    }
    return null;
  }, [blockData, customNumberingStyle]);

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

      {useOrder && isEditMode ? (
        <StartNumbering
          t={t}
          custom={customNumberingStyle}
          type={useOrder}
          value={value}
          onChange={onChange}
        />
      ) : null}

      {value?.value.map((item, index) => (
        <CurriculumListItem
          key={index}
          label={getTitle(value, index)}
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
          {store.showSaveButton || useOrder ? (
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
