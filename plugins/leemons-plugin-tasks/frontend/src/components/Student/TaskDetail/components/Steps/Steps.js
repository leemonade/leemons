import React from 'react';
import _ from 'lodash';
import { VerticalStepper, Box, createStyles, Button } from '@bubbles-ui/components';
import updateStudentRequest from '@tasks/request/instance/updateStudent';
import useStudentAssignationMutation from '@tasks/hooks/student/useStudentAssignationMutation';
import { ChevLeftIcon, ChevRightIcon } from '@bubbles-ui/icons/outline';
import StatementStep from './Steps/StatementStep';
import DevelopmentStep from './Steps/DevelopmentStep';
import DeliveryStep from './Steps/DeliveryStep';
import Sidebar from '../Sidebar';
import LimitedTimeAlert from '../LimitedTimeAlert';
import Countdown from '../Countdown';
import FinalizationModal from '../FinalizationModal';

const useStepsStyles = createStyles((theme, { marginTop }) => ({
  root: {
    position: 'absolute',
    top: marginTop,
    height: `calc(100vh - ${marginTop}px)`,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepperContainer: {
    minWidth: 276,
    width: 276,
    maxWidth: 276,
    height: 'fit-content',
  },
  stepper: {
    width: 276,
    position: 'absolute',
    top: 0,
  },
  contentContainer: {
    paddingLeft: theme.spacing[13],
    paddingRight: theme.spacing[13],
    paddingTop: theme.spacing[7],
    width: '100%',
    height: '100%',
    minHeight: '100%',
    overflow: 'auto',
    overflowX: 'clip',
  },
  content: {
    width: '100%',
    maxWidth: theme.breakpoints.sm,
    height: '100%',
    paddingTop: theme.spacing[7],
  },
  buttonsBar: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    gap: theme.spacing[4],
    padding: theme.spacing[4],
    paddingBottom: theme.spacing[10],
    paddingTop: theme.spacing[6],
  },
  sidebarContainer: {
    minWidth: 280,
    maxWidth: 280,
  },
  sidebar: {
    width: 280,
    position: 'absolute',
    height: '100%',
    right: 0,
    top: 0,
  },
}));

function useSteps({ assignation, localizations }) {
  const assignable = assignation?.instance?.assignable;

  const hasDeliverable = !!assignable?.submission?.type;
  const developmentLength = assignable?.metadata?.development?.length;
  const hasDevelopment = developmentLength > 0;
  const hasNextActivity = assignation?.instance?.relatedAssignableInstances?.after?.length > 0;

  const steps = React.useMemo(() => {
    if (!localizations) {
      return [];
    }

    return [
      {
        id: 'statement',
        label: hasDeliverable
          ? localizations?.steps?.statement
          : localizations?.steps?.presentation,
        component: <StatementStep />,
        customButtons: !hasDevelopment,
        status: 'OK',
      },
      hasDevelopment && {
        id: 'development',
        label: localizations?.steps?.development,
        component: <DevelopmentStep />,
        customButtons: true,
        status: 'OK',
      },
      hasDeliverable && {
        id: 'submission',
        label: localizations?.steps?.submission,
        component: <DeliveryStep />,
        customButtons: true,
        status: 'OK',
      },
    ].filter(Boolean);
  }, [assignation, localizations, hasDeliverable, hasDevelopment]);

  const visitedSteps = assignation?.metadata?.visitedSteps?.map((step) =>
    steps.findIndex(({ id }) => id === step)
  );

  const [index, setIndex] = React.useState(0);
  const [previousIndex, setPreviousIndex] = React.useState(null);

  const onNextStep = React.useCallback(() => {
    setIndex((i) => {
      if (i + 1 < steps?.length) {
        setPreviousIndex(i);
        return i + 1;
      }
      return i;
    });
  }, [setIndex, steps?.length, index]);

  const onPrevStep = React.useCallback(() => {
    setIndex((i) => {
      if (i > 0) {
        setPreviousIndex(i);
        return i - 1;
      }
      return i;
    });
  }, [setIndex]);

  const setStep = React.useCallback(
    (newIndex) => {
      if (newIndex >= 0 && newIndex < steps?.length) {
        setPreviousIndex(newIndex === 0 ? null : newIndex - 1);
        setIndex(newIndex);
      }
    },
    [steps?.length]
  );

  return {
    steps,
    visitedSteps,
    index,
    previousIndex,
    onNextStep,
    onPrevStep,
    setStep,
    hasPrev: index > 0,
    hasNext: index < steps?.length - 1,
    hasDeliverable,
    hasDevelopment,
    hasNextActivity,
  };
}

function setDefaultButtons({
  onPrevStep,
  onNextStep,
  toggleModal,
  hasPrev,
  hasNext,
  hasDeliverable,
  hasNextActivity,
  localizations,
  preview,
}) {
  return (
    <>
      <Box>
        {hasPrev && (
          <Button variant="link" onClick={onPrevStep} rounded leftIcon={<ChevLeftIcon />}>
            {localizations?.buttons?.previous}
          </Button>
        )}
      </Box>
      <Box>
        {(hasNext || hasDeliverable || !hasNextActivity) && (
          <Button
            variant={hasNext ? 'outline' : 'filled'}
            onClick={() => (hasNext ? onNextStep() : toggleModal.current())}
            rounded
            disabled={!hasNext && preview}
            rightIcon={hasNext && <ChevRightIcon />}
          >
            {hasNext ? localizations?.buttons?.next : localizations?.buttons?.finish}
          </Button>
        )}
        {!hasNext && !hasDeliverable && hasNextActivity && (
          <Button
            variant="filled"
            rounded
            onClick={() => (hasNext ? onNextStep() : toggleModal.current())}
            disabled={preview}
            rightIcon={<ChevRightIcon />}
          >
            {localizations?.buttons?.nextActivity}
          </Button>
        )}
      </Box>
    </>
  );
}

function setButtonsf(setButtons) {
  return (newButtons) => {
    setButtons(newButtons);
  };
}

export function useUpdateTimestamps(mutateAsync, assignation) {
  return React.useCallback(
    async (timestamps) => {
      if (timestamps && !assignation?.timestamps?.[timestamps]) {
        try {
          const time = Date.now();
          await mutateAsync({
            instance: assignation?.instance?.id ?? assignation?.instance,
            student: assignation?.user,
            timestamps: {
              [timestamps]: time,
            },
          });
        } catch (e) {
          // TODO: Handle error
        }
      }
    },
    [assignation?.id, assignation.instance, mutateAsync]
  );
}

async function useUpdateVisitedSteps(assignation, step, preview) {
  React.useMemo(async () => {
    if (step?.id && !assignation?.metadata?.visitedSteps?.includes(step.id) && !preview) {
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
  }, [step?.id]);
}

export default function Steps({ assignation, localizations, marginTop, setIsFirstStep, preview }) {
  const [buttons, setButtons] = React.useState(null);

  const { classes, theme } = useStepsStyles({ marginTop });

  const {
    steps,
    visitedSteps,
    index,
    previousIndex,
    onNextStep,
    onPrevStep,
    setStep,
    hasPrev,
    hasNext,
    hasDeliverable,
    hasDevelopment,
    hasNextActivity,
  } = useSteps({
    assignation,
    localizations,
    setButtons,
  });

  React.useEffect(() => {
    setIsFirstStep(index === 0);
  }, [index === 0]);

  const { mutateAsync } = useStudentAssignationMutation();
  const updateTimestamps = useUpdateTimestamps(mutateAsync, assignation);

  const toggleModal = React.useRef(null);

  React.useEffect(() => {
    if (assignation) {
      updateTimestamps('open');
    }
  }, [assignation?.id]);

  const currentStep = steps[index];

  useUpdateVisitedSteps(assignation, currentStep, preview);

  React.useEffect(() => {
    if (!currentStep.customButtons) {
      setButtonsf(setButtons)(
        setDefaultButtons({
          onPrevStep,
          onNextStep,
          toggleModal,
          hasPrev,
          hasNext,
          localizations,
          hasDeliverable,
          hasNextActivity,
          preview,
        })
      );
    }
  }, [currentStep, localizations?.buttons, preview]);

  const currentStepComponent = React.useMemo(
    () =>
      React.cloneElement(currentStep?.component, {
        assignation,
        localizations,
        setButtons: currentStep.customButtons ? setButtonsf(setButtons) : () => { },
        onNextStep: () => (hasNext ? onNextStep : toggleModal.current)(),
        onPrevStep,
        setStep,
        hasPrevStep: hasPrev,
        hasNextStep: hasNext,
        hasDeliverable,
        hasNextActivity,
        index,
        previousIndex,
        updateTimestamps,
        marginTop: marginTop + theme.spacing[7] * 2,
        preview,
      }),
    [
      currentStep?.component,
      assignation,
      localizations,
      setButtons,
      marginTop,
      theme.spacing[7],
      preview,
    ]
  );

  return (
    <>
      <FinalizationModal
        updateTimestamps={updateTimestamps}
        assignation={assignation}
        toggleModal={toggleModal}
        localizations={localizations?.confirmation_modal}
        actionUrl="/private/assignables/ongoing"
      />
      <Box className={classes.root}>
        <Box className={classes.stepperContainer}>
          <Box className={classes.stepper}>
            <VerticalStepper
              data={steps}
              currentStep={index}
              completedSteps={visitedSteps}
              visitedSteps={visitedSteps}
              onChangeActiveIndex={setStep}
            />
          </Box>
        </Box>
        <Box className={classes.contentContainer}>
          <Box className={classes.content}>
            <Countdown
              assignation={assignation}
              show
              onTimeout={() => {
                /* updateTimestamps(assignation, 'end') */
              }}
              localizations={localizations?.timeout_modal}
              updateTimestamps={updateTimestamps}
            />
            {currentStepComponent}
            <LimitedTimeAlert
              assignation={assignation}
              labels={localizations?.limitedTimeAlert}
              show={hasDeliverable && !hasDevelopment && currentStep.id === 'statement'}
            />
            <Box className={classes.buttonsBar}>{buttons}</Box>
          </Box>
        </Box>
        <Box className={classes.sidebarContainer}>
          <Box className={classes.sidebar}>
            <Sidebar assignation={assignation} labels={localizations} show />
          </Box>
        </Box>
      </Box>
    </>
  );
}
