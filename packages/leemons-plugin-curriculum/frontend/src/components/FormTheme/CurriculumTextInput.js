import React from 'react';
import PropTypes from 'prop-types';
import { Button, ContextContainer, Stack, TextInput } from '@bubbles-ui/components';
import { useStore } from '@common';

function CurriculumTextInput({ onChange, isEditMode = true, value, onSave, schema, t }) {
  const [store, render] = useStore();

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
};

export default CurriculumTextInput;
