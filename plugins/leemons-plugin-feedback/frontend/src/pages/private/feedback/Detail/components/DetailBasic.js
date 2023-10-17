import React from 'react';
import PropTypes from 'prop-types';
import { Button, ContextContainer, Stack } from '@bubbles-ui/components';
import { ChevRightIcon } from '@bubbles-ui/icons/outline';
import AssetFormInput from '@leebrary/components/AssetFormInput';

export default function DetailBasic({ advancedConfig, form, t, onNext }) {
  async function next() {
    const formGood = await form.trigger(['name']);
    if (formGood) {
      onNext();
    }
  }

  return (
    <ContextContainer divided>
      <AssetFormInput
        form={form}
        preview
        advancedConfig={advancedConfig}
        tagsPluginName="feedback"
        category="assignables.feedback"
      />

      <Stack fullWidth justifyContent="end">
        <Button rightIcon={<ChevRightIcon height={20} width={20} />} onClick={next}>
          {t('continue')}
        </Button>
      </Stack>
    </ContextContainer>
  );
}

DetailBasic.propTypes = {
  advancedConfig: PropTypes.object,
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  onNext: PropTypes.func,
};
