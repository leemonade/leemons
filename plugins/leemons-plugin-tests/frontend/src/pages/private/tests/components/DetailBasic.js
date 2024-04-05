import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  TotalLayoutStepContainer,
  TotalLayoutFooterContainer,
} from '@bubbles-ui/components';
import { ChevRightIcon } from '@bubbles-ui/icons/outline';
import AssetFormInput from '@leebrary/components/AssetFormInput';

export default function DetailBasic({
  t,
  form,
  store,
  stepName,
  scrollRef,
  onSave,
  onNext,
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
                {t('next')}
              </Button>
            </>
          }
        />
      }
    >
      <AssetFormInput
        advancedConfig={advancedConfig}
        form={form}
        preview
        tagsPluginName="tests"
        category="assignables.tests"
      />
    </TotalLayoutStepContainer>
  );
}

DetailBasic.propTypes = {
  t: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  advancedConfig: PropTypes.object,
  stepName: PropTypes.string,
  Footer: PropTypes.any,
  onNext: PropTypes.func,
  onSave: PropTypes.func,
  scrollRef: PropTypes.any,
  store: PropTypes.object,
};
