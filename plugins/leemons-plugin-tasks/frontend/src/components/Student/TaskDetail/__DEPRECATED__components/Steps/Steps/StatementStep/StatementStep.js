import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import {
  Box,
  Button,
  ContextContainer,
  HtmlText,
  ImageLoader,
  Title,
} from '@bubbles-ui/components';
import { ChevRightIcon } from '@bubbles-ui/icons/outline';
import { useSupportImage, CurriculumRender } from './CurriculumRender';

export default function StatementStep({
  assignation,
  localizations: _labels,
  setButtons,
  hasNextStep,
  hasNextActivity,
  onNextStep,
  preview,
}) {
  const labels = _labels.statement_step;

  const { instance } = assignation;
  const { assignable } = instance;

  const { data: supportImage } = useSupportImage(assignable);
  const showCurriculum = instance.curriculum;
  const isGradable = assignable.gradable;

  const now = dayjs();
  const startDate = dayjs(assignation?.instance?.dates?.start || null);
  const canSubmit =
    (!!preview && hasNextStep) ||
    (!preview &&
      (assignation?.instance?.alwaysAvailable ||
        (startDate.isValid() && !now.isBefore(startDate))));

  React.useEffect(() => {
    setButtons(
      <>
        <Box></Box>
        {(hasNextStep || !hasNextActivity) && (
          <Button
            onClick={onNextStep}
            variant={hasNextStep ? 'outline' : 'filled'}
            rightIcon={<ChevRightIcon />}
            rounded
            disabled={!canSubmit}
          >
            {hasNextStep ? _labels?.buttons?.next : _labels?.buttons?.finish}
          </Button>
        )}
        {!hasNextStep && hasNextActivity && (
          <Button
            variant="filled"
            rightIcon={<ChevRightIcon />}
            disabled={!canSubmit}
            rounded
            onClick={onNextStep}
          >
            {_labels?.buttons?.nextActivity}
          </Button>
        )}
      </>
    );
  }, [setButtons, onNextStep, hasNextStep, _labels?.buttons, hasNextActivity, canSubmit]);

  return (
    <ContextContainer>
      <ContextContainer>
        <Title order={2} color="primary">
          {isGradable ? labels?.statement : labels?.presentation}
        </Title>
        <HtmlText>{assignable?.statement}</HtmlText>
        {!!supportImage && <ImageLoader src={supportImage.url} height="auto" />}
      </ContextContainer>
      <CurriculumRender
        assignation={assignation}
        showCurriculum={showCurriculum}
        labels={labels?.curriculum}
      />
    </ContextContainer>
  );
}

StatementStep.propTypes = {
  assignation: PropTypes.shape({
    instance: PropTypes.shape({
      curriculum: PropTypes.shape({
        content: PropTypes.bool,
        assessmentCriteria: PropTypes.bool,
        objectives: PropTypes.bool,
      }),
      assignable: PropTypes.shape({
        statement: PropTypes.string,
        curriculum: PropTypes.shape({
          content: PropTypes.arrayOf(PropTypes.string),
          assessmentCriteria: PropTypes.arrayOf(PropTypes.string),
          objectives: PropTypes.arrayOf(PropTypes.string),
        }),
      }),
    }),
  }),
  localizations: PropTypes.shape({
    statement_step: PropTypes.object,
  }),
  setButtons: PropTypes.func,
  hasNextStep: PropTypes.bool,
  hasNextActivity: PropTypes.bool,
  onNextStep: PropTypes.func,
};
