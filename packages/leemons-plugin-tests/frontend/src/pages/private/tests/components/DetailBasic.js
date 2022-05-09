import React from 'react';
import PropTypes from 'prop-types';
import { Button, Stack } from '@bubbles-ui/components';
import AssetFormInput from '@leebrary/components/AssetFormInput';

export default function DetailBasic({ form, t, onNext }) {
  async function next() {
    const formGood = await form.trigger(['name']);
    if (formGood) {
      onNext();
    }
  }

  return (
    <AssetFormInput
      form={form}
      preview
      tagsPluginName="tests"
      tagsType="plugins.tests.tests"
      category="assignables.tests"
    >
      <Stack justifyContent="end">
        <Button onClick={next}>{t('continue')}</Button>
      </Stack>
    </AssetFormInput>
  );
}

DetailBasic.propTypes = {
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  onNext: PropTypes.func,
};
