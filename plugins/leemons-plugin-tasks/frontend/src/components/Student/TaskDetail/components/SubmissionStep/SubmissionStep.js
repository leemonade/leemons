import { useState } from 'react';

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
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

import useSubmissionStepStyles from './SubmissionStep.style';
import File from './components/File/File';
import SubmissionLink from './components/Link/Link';

import { prefixPN } from '@tasks/helpers';

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
  const isLink = assignable?.submission?.type === 'Link';
  const [submissionT] = useTranslateLoader(
    prefixPN(isLink ? 'task_realization.submission_link' : 'task_realization.submission_file')
  );

  const submission = assignation?.metadata?.submission;

  const now = dayjs();
  const deadline = assignation?.instance?.dates?.deadline;
  const closed = assignation?.instance?.dates?.closed;
  const isFinished = closed || (deadline && now.isAfter(deadline));

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
        {isFinished && !submission && (
          <Alert severity="error" closeable={false}>
            {submissionT('submissionsFinished')}
          </Alert>
        )}
        {!!assignable?.submission?.description && (
          <Box>
            <ContextContainer title={t('instructions')}>
              <HtmlText>{assignable?.submission?.description}</HtmlText>
            </ContextContainer>
          </Box>
        )}

        {(!isFinished || !!submission) && assignable?.submission?.type === 'Link' && (
          <SubmissionLink assignation={assignation} preview={preview} />
        )}

        {(!isFinished || !!submission) && assignable?.submission?.type === 'File' && (
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
