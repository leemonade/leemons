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
  savingAs,
  stepName,
  advancedConfig,
  scrollRef,
  onNext,
  onSaveDraft,
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
      onSaveDraft();
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
                  disabled={savingAs}
                  loading={savingAs === 'draft'}
                >
                  {t('saveDraft')}
                </Button>
              ) : null}

              <Button
                rightIcon={<ChevRightIcon height={20} width={20} />}
                onClick={handleOnNext}
                disabled={savingAs}
                loading={savingAs === 'published'}
              >
                {t('next')}
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
  onSaveDraft: PropTypes.func,
  savingAs: PropTypes.string,
  stepName: PropTypes.string,
  scrollRef: PropTypes.any,
};
