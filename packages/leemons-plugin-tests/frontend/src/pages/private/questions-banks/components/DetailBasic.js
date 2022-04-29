import React from 'react';
import PropTypes from 'prop-types';
import { Button, Stack } from '@bubbles-ui/components';
import { useStore } from '@common';
import AssetFormInput from '@leebrary/components/AssetFormInput';

export default function DetailBasic({ form, t, onNext }) {
  const [isDirty, setIsDirty] = React.useState(false);
  const [store, render] = useStore({
    subjectsByProgram: {},
  });
  const program = form.watch('program');

  async function next() {
    setIsDirty(true);
    const formGood = await form.trigger(['name', 'tagline', 'description', 'coverFile', 'color']);
    if (formGood) {
      onNext();
    }
  }

  return (
    <AssetFormInput
      form={form}
      preview
      tagsPluginName="tests"
      tagsType="plugins.tests.questionBanks"
      category="tests-questions-banks"
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
