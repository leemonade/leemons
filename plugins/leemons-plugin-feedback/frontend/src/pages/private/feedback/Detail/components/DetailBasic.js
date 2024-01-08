import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  TotalLayoutStepContainer,
  TotalLayoutFooterContainer,
} from '@bubbles-ui/components';
import { ChevRightIcon } from '@bubbles-ui/icons/outline';
import AssetFormInput from '@leebrary/components/AssetFormInput';
import { noop } from 'lodash';

export default function DetailBasic({
  t,
  form,
  store = {},
  stepName,
  scrollRef,
  onSave = noop,
  onNext = noop,
  advancedConfig,
}) {
  const formValues = form.watch();
  const validate = async () => form.trigger(['name']);

  const handleOnNext = async () => {
    if (await validate()) {
      onNext();
    }
  };

  const handleOnSave = async () => {
    if (await validate()) {
      onSave();
    }
  };

  return (
    <TotalLayoutStepContainer
      stepName={stepName}
      Footer={
        <TotalLayoutFooterContainer
          fixed
          scrollRef={scrollRef}
          rightZone={
            <>
              {!formValues.published ? (
                <Button
                  variant="link"
                  onClick={handleOnSave}
                  disabled={store.saving}
                  loading={store.saving === 'draft'}
                >
                  {t('saveDraft')}
                </Button>
              ) : null}

              <Button
                rightIcon={<ChevRightIcon height={20} width={20} />}
                onClick={handleOnNext}
                disabled={store.saving}
                loading={store.saving === 'publish'}
              >
                {t('continue')}
              </Button>
            </>
          }
        />
      }
    >
      <AssetFormInput
        form={form}
        preview
        advancedConfig={advancedConfig}
        tagsPluginName="feedback"
        category="assignables.feedback"
      />
    </TotalLayoutStepContainer>
  );
}

DetailBasic.propTypes = {
  advancedConfig: PropTypes.object,
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  onNext: PropTypes.func,
  onSave: PropTypes.func,
  scrollRef: PropTypes.object,
  store: PropTypes.object,
  stepName: PropTypes.string,
};
