import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  TotalLayoutFooterContainer,
  TotalLayoutStepContainer,
} from '@bubbles-ui/components';
import { ChevRightIcon } from '@bubbles-ui/icons/outline';
import AssetFormInput from '@leebrary/components/AssetFormInput';

export default function DetailBasic({
  form,
  t,
  store,
  stepName,
  advancedConfig,
  scrollRef,
  onNext,
  onSave,
}) {
  const formValues = form.watch();

  const validate = async () => form.trigger(['name', 'program', 'subjects']);

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
      <Box style={{ marginBottom: 20 }}>
        <AssetFormInput
          advancedConfig={advancedConfig}
          form={form}
          preview
          tagsPluginName="tests"
          category="tests-questions-banks"
        />
      </Box>
    </TotalLayoutStepContainer>
  );
}

DetailBasic.propTypes = {
  advancedConfig: PropTypes.object,
  form: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  onNext: PropTypes.func,
  onSave: PropTypes.func,
  store: PropTypes.object,
  stepName: PropTypes.string,
  scrollRef: PropTypes.any,
};
