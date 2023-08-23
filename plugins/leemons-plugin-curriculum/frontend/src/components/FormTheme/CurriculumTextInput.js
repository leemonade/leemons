import { Button, ContextContainer, Stack, TextInput } from '@bubbles-ui/components';
import { useStore } from '@common';
import { returnFirstMetadataParent } from '@curriculum/helpers/returnFirstMetadataParent';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { ParentRelation } from './ParentRelation';

function CurriculumTextInput({
  onChange: _onChange,
  isEditMode = true,
  curriculum,
  id,
  blockData,
  value: _value,
  onSave,
  schema,
  t,
}) {
  const [store, render] = useStore({
    parentValue: returnFirstMetadataParent(_value),
  });

  // eslint-disable-next-line no-nested-ternary
  const value = _.isArray(_value)
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
        ...(e || { value: null, metadata: {} }),
        metadata: {
          ...(e?.metadata || {}),
          parentRelated: store.parentValue,
        },
      });
    }
    return _onChange(e);
  }

  function onChangeValue(e) {
    onChange({ ...value, value: e });
  }

  async function save() {
    store.loading = true;
    render();
    await onSave();
    store.loading = false;
    render();
  }

  return (
    <ContextContainer>
      <ParentRelation
        curriculum={curriculum}
        blockData={blockData}
        value={{
          ...(value || { value: null, metadata: {} }),
          metadata: { ...(value?.metadata || {}), parentRelated: store.parentValue },
        }}
        isEditMode={isEditMode}
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

      <TextInput
        readOnly={!isEditMode}
        label={schema.title}
        value={value?.value}
        onChange={onChangeValue}
      />
      {isEditMode ? (
        <Stack justifyContent="end">
          <Button variant="outline" loading={store.loading} onClick={save}>
            {t('save')}
          </Button>
        </Stack>
      ) : null}
    </ContextContainer>
  );
}

CurriculumTextInput.defaultProps = {
  onSave: () => {},
};

CurriculumTextInput.propTypes = {
  onChange: PropTypes.func,
  isEditMode: PropTypes.bool,
  value: PropTypes.any,
  schema: PropTypes.any,
  onSave: PropTypes.func,
  t: PropTypes.func,
  curriculum: PropTypes.any,
  id: PropTypes.string,
  blockData: PropTypes.any,
};

export default CurriculumTextInput;
