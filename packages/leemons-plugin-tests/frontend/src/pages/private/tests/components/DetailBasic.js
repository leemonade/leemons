import React from 'react';
import PropTypes from 'prop-types';
import { Button, Stack, ContextContainer } from '@bubbles-ui/components';
import AssetFormInput from '@leebrary/components/AssetFormInput';
import { ChevRightIcon } from '@bubbles-ui/icons/outline';

export default function DetailBasic({ form, t, onNext }) {
  async function next() {
    const formGood = await form.trigger(['name']);
    if (formGood) {
      onNext();
    }
  }

  return (
    <ContextContainer divided>
      <AssetFormInput form={form} preview tagsPluginName="tests" category="assignables.tests" />
      <Stack fullWidth justifyContent="end">
        <Button rightIcon={<ChevRightIcon height={20} width={20} />} onClick={next}>
          {t('continue')}
        </Button>
      </Stack>
    </ContextContainer>
  );
}

DetailBasic.propTypes = {
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  onNext: PropTypes.func,
};
