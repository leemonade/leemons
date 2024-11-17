import React from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import { DropdownButton } from '@bubbles-ui/components';

export default function FinalDropdown({
  t,
  form,
  store,
  setIsDirty = noop,
  onPublish = noop,
  onAssign = noop,
  disabled,
}) {
  // ························································
  // HANDLERS
  const validate = async () => form.trigger(['instructionsForTeachers', 'instructionsForStudents']);

  async function handleOnPublish() {
    setIsDirty(true);
    if (await validate()) {
      onPublish();
    }
  }

  async function handleOnAssign() {
    setIsDirty(true);
    if (await validate()) {
      onAssign();
    }
  }

  return (
    <DropdownButton
      chevronUp
      width="auto"
      data={[
        { label: t('onlyPublish'), onClick: handleOnPublish },
        { label: t('publishAndAssign'), onClick: handleOnAssign },
      ]}
      // loading={store.saving === 'publish'}
      disabled={disabled}
    >
      {t('finish')}
    </DropdownButton>
  );
}

FinalDropdown.propTypes = {
  t: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  onPublish: PropTypes.func,
  onAssign: PropTypes.func,
  store: PropTypes.any,
  setIsDirty: PropTypes.func,
  disabled: PropTypes.bool,
};
