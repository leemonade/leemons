import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  TotalLayoutFooterContainer,
  TotalLayoutStepContainer,
  Button,
  ContextContainer,
  HtmlText,
  Box,
  Alert,
} from '@bubbles-ui/components';
import { ChevLeftIcon } from '@bubbles-ui/icons/outline';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@tasks/helpers';
import Link from './components/Link/Link';
import File from './components/File/File';
import useSubmissionStepStyles from './SubmissionStep.style';

function SubmissionStep({
  stepName,
  instance,
  assignation,
  scrollRef,
  preview,
  onPrevStep,
  onNextStep,
}) {
  const [t] = useTranslateLoader(prefixPN('task_realization.submission_step'));
  const [buttonsT] = useTranslateLoader(prefixPN('task_realization.buttons'));

  const [isLoading, setIsLoading] = useState(false);

  const { assignable } = instance ?? {};

  const submission = assignation?.metadata?.submission;

  const { classes } = useSubmissionStepStyles();

  return (
    <TotalLayoutStepContainer
      stepName={stepName}
      Footer={
        <TotalLayoutFooterContainer
          scrollRef={scrollRef}
          fixed
          leftZone={
            <Button variant="outline" leftIcon={<ChevLeftIcon />} onClick={onPrevStep}>
              {buttonsT('previous')}
            </Button>
          }
          rightZone={
            <Button
              loading={isLoading}
              onClick={async () => {
                setIsLoading(true);
                await onNextStep();
                setIsLoading(false);
              }}
              disabled={!submission || preview}
            >
              {buttonsT('submit')}
            </Button>
          }
        />
      }
    >
      <Box className={classes.root}>
        {!!assignable?.submission?.description && (
          <Box>
            <ContextContainer title={t('instructions')}>
              <HtmlText>{assignable?.submission?.description}</HtmlText>
            </ContextContainer>
          </Box>
        )}

        {assignable?.submission?.type === 'Link' && (
          <Link assignation={assignation} preview={preview} />
        )}

        {assignable?.submission?.type === 'File' && (
          <File assignation={assignation} preview={preview} />
        )}

        {!preview && !!assignation?.metadata?.submission && (
          <Alert severity="warning" closeable={false} title={t('notfinished_title')}>
            {t('notfinished_message')}
          </Alert>
        )}
      </Box>
    </TotalLayoutStepContainer>
  );
}

SubmissionStep.propTypes = {
  stepName: PropTypes.string.isRequired,
  instance: PropTypes.object,
  assignation: PropTypes.object,
  scrollRef: PropTypes.object,
  preview: PropTypes.bool,
  onPrevStep: PropTypes.func.isRequired,
  onNextStep: PropTypes.func.isRequired,
};

export default SubmissionStep;
