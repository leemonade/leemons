/* eslint-disable no-param-reassign */
import { Box, Button } from '@bubbles-ui/components';
import { useStore } from '@common';
import CurriculumGroupItem from '@curriculum/components/FormTheme/CurriculumGroupItem';
import { ParentRelation } from '@curriculum/components/FormTheme/ParentRelation';
import { returnFirstMetadataParent } from '@curriculum/helpers/returnFirstMetadataParent';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

function CurriculumGroup({
  onChange: _onChange,
  isEditMode = true,
  value: _value,
  curriculum,
  schema,
  blockData,
  onSave,
  id,
  t,
}) {
  const [store, render] = useStore({
    parentValue: returnFirstMetadataParent(_value),
  });

  // eslint-disable-next-line no-nested-ternary
  let value = _.isArray(_value)
    ? store.parentValue
      ? _.find(_value, { metadata: { parentRelated: store.parentValue } })
      : _value[0]
    : _value;

  function onChange(e, fromParent) {
    if (store.parentValue) {
      if (fromParent === true) {
        e = _.find(_value, { metadata: { parentRelated: store.parentValue } });
      }
      return _onChange({
        ...(e || { value: {}, metadata: {} }),
        metadata: {
          ...(e?.metadata || {}),
          parentRelated: store.parentValue,
        },
      });
    }
    return _onChange(e);
  }

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

  function onUpdate(itemId, newValues, close = true) {
    if (close) store.editingItem = null;
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
  }, [blockData?.id]);

  return (
    <Box>
      <ParentRelation
        curriculum={curriculum}
        blockData={blockData}
        isEditMode={isEditMode}
        value={{
          ...(value || { value: {}, metadata: {} }),
          metadata: { ...(value?.metadata || {}), parentRelated: store.parentValue },
        }}
        onChange={(e) => {
          store.parentValue = e.metadata.parentRelated;
          render();
          onChange(e, true);
        }}
        isShow={(e) => {
          store.showSaveButton = e;
          render();
        }}
        id={id}
        t={t}
      />

      {blockData?.elements.map((item, index) => (
        <CurriculumGroupItem
          key={item.id + index}
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
          onSave={(e, close = true) => {
            onUpdate(item.id, e, close);
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
