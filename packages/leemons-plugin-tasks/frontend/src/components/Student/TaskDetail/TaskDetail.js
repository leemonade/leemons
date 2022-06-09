import React, { useMemo, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAssignations from '@assignables/hooks/assignations/useAssignations';
import {
  VerticalStepper,
  Loader,
  Stack,
  Box,
  ContextContainer,
  Button,
  HtmlText,
} from '@bubbles-ui/components';
import useClassData from '@assignables/hooks/useClassData';
import { getFileUrl } from '@leebrary/helpers/prepareAsset';
import { ChevRightIcon, ChevLeftIcon } from '@bubbles-ui/icons/outline';
import _ from 'lodash';
import { unflatten, useLocale } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useLayout } from '@layout/context';
import { ActivityContainer } from '@bubbles-ui/leemons';
import useSteps from './helpers/useSteps';
import { TaskDetailStyles } from './TaskDetail.style';
import Sidebar from './components/Sidebar';
import updateStudentRequest from '../../../request/instance/updateStudent';
import useStudentAssignationMutation from '../../../hooks/student/useStudentAssignationMutation';
import { prefixPN } from '../../../helpers';
import Countdown from './components/Countdown';
import LimitedTimeAlert from './components/LimitedTimeAlert/LimitedTimeAlert';

function useUpdateTimestamps(mutateAsync) {
  return useMemo(
    () => async (assignation, timestamps) => {
      if (timestamps && !assignation?.timestamps?.[timestamps]) {
        try {
          const time = Date.now();
          await mutateAsync({
            instance: assignation?.instance?.id,
            student: assignation.user,
            timestamps: {
              [timestamps]: time,
            },
          });
        } catch (e) {
          // TODO: Handle error
        }
      }
    },
    [mutateAsync]
  );
}

async function updateVisitedSteps(assignation, step) {
  if (step?.id && !assignation?.metadata?.visitedSteps?.includes(step.id)) {
    try {
      const visitedSteps = [...(assignation?.metadata?.visitedSteps || []), step.id];
      await updateStudentRequest({
        instance: assignation?.instance?.id,
        student: assignation.user,
        metadata: {
          ...assignation?.metadata,
          visitedSteps,
        },
      });

      _.set(assignation, 'metadata.visitedSteps', visitedSteps);
    } catch (e) {
      // TODO: Handle error
    }
  }
}

function getNextButtonLabel(step, isLastStep, labels) {
  if (typeof step?.next === 'string') {
    return step?.next;
  }

  if (isLastStep) {
    return labels.finish;
  }

  return labels.next;
}

function Content({ marginTop, setMargin, children }) {
  useEffect(() => {
    if (typeof setMargin === 'function') {
      setMargin(marginTop);
    }
  }, [marginTop, setMargin]);

  return children;
}

export default function TaskDetail({ id, student }) {
  const { mutateAsync } = useStudentAssignationMutation();
  // const [disableQuery, setDisableQuery] = useState(false);
  const updateTimestamps = useUpdateTimestamps(mutateAsync);
  const locale = useLocale();
  const [marginTop, setMarginTop] = useState(0);
  const { openConfirmationModal } = useLayout();
  const {
    data: assignation,
    error,
    isLoading: loading,
  } = useAssignations({ instance: id, user: student }, true);
  const [disabledButtons, setDisabledButtons] = useState({
    previous: false,
    next: false,
    save: false,
  });
  const asset = assignation?.instance?.assignable?.asset;
  const coverUrl = useMemo(() => getFileUrl(asset?.cover), [asset?.cover]);
  const history = useHistory();

  if (assignation?.finished) {
    history.push('/private/assignables/ongoing');
  }

  const [, translations] = useTranslateLoader([
    prefixPN('task_realization'),
    'plugins.assignables.multiSubject',
  ]);

  const labels = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = _.get(res, prefixPN('task_realization'));
      data.multiSubject = _.get(res, 'plugins.assignables.multiSubject');

      // EN: Modify the data object here
      // ES: Modifica el objeto data aquí
      return data;
    }

    return {};
  }, [translations]);

  const disableButton = (button, value = true) => {
    if (disabledButtons[button] !== undefined) {
      setDisabledButtons((v) => ({ ...v, [button]: value }));
    }
  };

  const resetButtons = () => {
    setDisabledButtons({
      previous: false,
      next: false,
      save: false,
    });
  };

  const [currentStep, setCurrentStep] = useState(0);
  const { steps, visitedSteps } = useSteps({
    assignation,
    labels,
    disabledButtons,
    disableButton,
    currentStep,
  });

  const classData = useClassData(assignation?.instance?.classes, labels);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const step = steps[currentStep];

  const handleNext = async () => {
    if (typeof step.onNext?.current === 'function') {
      const proceed = await step.onNext.current();
      if (proceed === false) {
        return;
      }
    }

    if (!isLastStep) {
      setCurrentStep(currentStep + 1);
      resetButtons();
    } else if (steps.some((s) => s.showConfirmation)) {
      openConfirmationModal({
        onConfirm: async () => {
          await updateTimestamps(assignation, 'end');
          history.push('/private/assignables/ongoing');
        },
        title: labels?.confirmation_modal?.title,
        description: <HtmlText>{labels?.confirmation_modal?.description}</HtmlText>,
        labels: labels?.confirmation_modal?.labels,
      })();
    } else {
      await updateTimestamps(assignation, 'end');
      history.push('/private/assignables/ongoing');
    }
  };

  const handlePrev = async () => {
    if (currentStep > 0) {
      if (typeof step.onPrev?.current === 'function') {
        const proceed = await step.onPrev.current();
        if (proceed === false) {
          return;
        }
      }
      setCurrentStep(currentStep - 1);
      resetButtons();
    }
  };

  const handleSave = async () => {
    if (typeof step.onSave?.current === 'function') {
      const proceed = await step.onSave.current();
      if (proceed === false) {
      }
    }
  };

  const handleChangeActiveIndex = async (index) => {
    if (typeof step.onChangeActiveIndex?.current === 'function') {
      const proceed = await step.onChangeActiveIndex.current(index);
      if (proceed === false) {
        return;
      }
    }

    setCurrentStep(index);
    resetButtons();
  };

  const { classes, cx } = TaskDetailStyles({
    onlyNext: isFirstStep || step?.previous === false,
    marginTop,
  });

  useEffect(() => {
    if (assignation) {
      updateTimestamps(assignation, 'open');
    }
  }, [assignation]);

  useEffect(() => {
    if (assignation) {
      updateVisitedSteps(assignation, step);
    }
  }, [step?.id]);

  useEffect(() => {
    updateTimestamps(assignation, step?.timestamps);
  }, [step?.timestamps]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    // TODO: Add a stylish page for this error
    return `error: ${error.message}`;
    // return (
    //   <PageContainer>
    //     {/* TRANSLATE: Task detail title */}
    //     <AdminPageHeader title="Task Detail" />
    //     <ContextContainer>
    //       <Text>{error.message}</Text>
    //     </ContextContainer>
    //   </PageContainer>
    // );
  }

  return (
    <ActivityContainer
      header={{
        title: asset?.name,
        subtitle: classData?.name,
        icon: classData?.icon,
        color: classData?.color,
        image: coverUrl,
      }}
      deadline={
        assignation?.instance?.dates?.deadline && {
          label: 'Entrega',
          deadline:
            assignation?.instance?.dates?.deadline instanceof Date
              ? assignation?.instance?.dates?.deadline
              : new Date(assignation?.instance?.dates?.deadline),
          locale,
        }
      }
      collapsed={!isFirstStep}
    >
      <Content setMargin={setMarginTop}>
        <ContextContainer fullHeight spacing={0}>
          <Box className={classes?.root}>
            <Box className={classes?.stepper}>
              <Box className={cx(classes?.stepperFixed, classes?.stepper)}>
                <VerticalStepper
                  data={steps}
                  currentStep={currentStep}
                  completedSteps={visitedSteps}
                  visitedSteps={visitedSteps}
                  onChangeActiveIndex={handleChangeActiveIndex}
                />
              </Box>
            </Box>
            <Box className={classes?.content}>
              <Countdown
                assignation={assignation}
                show={step?.countdown === true}
                onTimeout={() => updateTimestamps(assignation, 'end')}
              />
              {step?.component}
              <LimitedTimeAlert
                assignation={assignation}
                labels={labels?.limitedTimeAlert}
                show={step?.limitedTimeAlert === true}
              />
              <Box className={classes?.nav}>
                {!isFirstStep && step?.previous !== false && (
                  <Button
                    rounded
                    compact
                    variant="light"
                    disabled={disabledButtons.previous}
                    leftIcon={<ChevLeftIcon height={20} width={20} />}
                    onClick={handlePrev}
                  >
                    {typeof step?.previous === 'string'
                      ? step?.previous
                      : labels?.buttons?.previous}
                  </Button>
                )}
                <Stack spacing={3}>
                  {step?.save !== undefined && step?.save !== false && (
                    <Button
                      variant="outline"
                      disabled={disabledButtons.save}
                      onClick={handleSave}
                      rounded
                    >
                      {typeof step?.save === 'string' ? step?.save : labels?.buttons?.save}
                    </Button>
                  )}
                  {step?.next !== false && (
                    <Button
                      rightIcon={<ChevRightIcon height={20} width={20} />}
                      disabled={disabledButtons.next}
                      onClick={handleNext}
                      rounded
                    >
                      {getNextButtonLabel(step, isLastStep, labels?.buttons)}
                    </Button>
                  )}
                </Stack>
              </Box>
            </Box>
            <Box className={classes?.sidebar}>
              <Box className={classes?.sidebarFixed}>
                <Sidebar
                  show={step?.sidebar === true}
                  assignation={assignation}
                  labels={labels?.sidebar}
                />
              </Box>
            </Box>
          </Box>
        </ContextContainer>
      </Content>
    </ActivityContainer>
  );
}
