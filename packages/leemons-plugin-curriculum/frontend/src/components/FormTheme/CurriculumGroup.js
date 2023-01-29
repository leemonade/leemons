/* eslint-disable no-param-reassign */
import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Box, Button } from '@bubbles-ui/components';
import { ParentRelation } from '@curriculum/components/FormTheme/ParentRelation';
import { useStore } from '@common';
import CurriculumGroupItem from '@curriculum/components/FormTheme/CurriculumGroupItem';

function CurriculumGroup({
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

  function onCancel() {
    store.editingItem = null;
    render();
  }

  function onUpdate(itemId, newValues) {
    store.editingItem = null;
    if (!value) value = {};
    if (!value.value || !_.isPlainObject(value.value)) value.value = {};
    value.value[itemId] = newValues;
    // console.log(value);
    onChange({ ...value });
    setTimeout(() => {
      save(true);
    }, 100);
  }

  function onEdit(index) {
    store.editingItem = { index };
    render();
  }

  React.useEffect(() => {
    onCancel();
  }, [blockData]);

  return (
    <Box>
      <ParentRelation
        curriculum={curriculum}
        blockData={blockData}
        isEditMode={isEditMode}
        value={value}
        onChange={onChange}
        isShow={(e) => {
          store.showSaveButton = e;
          render();
        }}
        id={id}
        t={t}
      />

      {blockData?.elements.map((item, index) => (
        <CurriculumGroupItem
          key={index}
          isEditMode={isEditMode}
          preview={!isEditMode ? true : store.editingItem?.index !== index}
          defaultValues={value?.value?.[item.id] || {}}
          item={item}
          parentRelated={value?.metadata?.parentRelated}
          schema={schema}
          curriculum={curriculum}
          id={id}
          blockData={blockData}
          t={t}
          onEdit={() => {
            onEdit(index);
          }}
          onSave={(e) => {
            onUpdate(item.id, e);
          }}
          onCancel={onCancel}
        />
      ))}

      {store.showSaveButton && isEditMode ? (
        <Box>
          <Button variant="outline" loading={store.loading} onClick={() => save()}>
            {t('save')}
          </Button>
        </Box>
      ) : null}
    </Box>
  );
}

CurriculumGroup.defaultProps = {
  onSave: () => {},
};

CurriculumGroup.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.any,
  schema: PropTypes.any,
  blockData: PropTypes.any,
  curriculum: PropTypes.any,
  onSave: PropTypes.func,
  id: PropTypes.string,
  t: PropTypes.func,
  isEditMode: PropTypes.bool,
};

export default CurriculumGroup;
