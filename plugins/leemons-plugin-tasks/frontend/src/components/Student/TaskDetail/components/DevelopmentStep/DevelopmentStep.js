import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  TotalLayoutFooterContainer,
  TotalLayoutStepContainer,
  Button,
  ContextContainer,
  HtmlText,
  Box,
} from '@bubbles-ui/components';
import { ChevLeftIcon, ChevRightIcon } from '@bubbles-ui/icons/outline';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@tasks/helpers';
import useStudentAssignationMutation from '@tasks/hooks/student/useStudentAssignationMutation';
import { Instructions } from '@tests/pages/private/tests/StudentInstance/components/Instructions';
import useDevelopmentStepStyles from './DevelopmentStep.styles';
import { useUpdateTimestamps } from '../../__DEPRECATED__components/Steps/Steps';

function DevelopmentStep({
  stepName,
  instance,
  assignation,
  scrollRef,
  preview,
  onNextStep,
  onPrevStep,
}) {
  const [t] = useTranslateLoader(prefixPN('task_realization.development_step'));
  const [buttonsT] = useTranslateLoader(prefixPN('task_realization.buttons'));
  const [isLoading, setIsLoading] = useState(false);

  /*
    === Handle student timestamps ===
  */
  const { mutateAsync } = useStudentAssignationMutation(assignation);
  const updateTimestamp = useUpdateTimestamps(mutateAsync, assignation);
  useEffect(() => {
    if (assignation) {
      updateTimestamp('start');
    }
  }, [updateTimestamp]);

  const { assignable } = instance ?? {};

  const developments = assignable?.metadata?.development || [];

  const { classes } = useDevelopmentStepStyles();

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
              variant={assignable?.submission ? 'outline' : 'primary'}
              rightIcon={!assignable?.submission || <ChevRightIcon />}
              loading={isLoading}
              disabled={!!preview && !assignable?.submission}
              onClick={async () => {
                if (!assignable?.submission) {
                  setIsLoading(true);
                }
                await onNextStep();

                setIsLoading(false);
              }}
            >
              {!assignable?.submission ? buttonsT('finish') : buttonsT('next')}
            </Button>
          }
        />
      }
    >
      <Box className={classes.root}>
        <Box>
          <Instructions instance={instance} />
        </Box>
        {!!developments?.length && (
          <Box>
            <ContextContainer title={t('development')}>
              {developments.map(({ development }, i) => (
                <HtmlText key={i}>{development}</HtmlText>
              ))}
            </ContextContainer>
          </Box>
        )}
      </Box>
    </TotalLayoutStepContainer>
  );
}

DevelopmentStep.propTypes = {
  stepName: PropTypes.string,
  instance: PropTypes.object,
  assignation: PropTypes.object,
  scrollRef: PropTypes.object,
  onNextStep: PropTypes.func,
  onPrevStep: PropTypes.func,
  preview: PropTypes.bool,
};

export default DevelopmentStep;
