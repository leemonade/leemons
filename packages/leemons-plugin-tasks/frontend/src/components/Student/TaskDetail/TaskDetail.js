import React, { useMemo, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAssignation from '@assignables/hooks/assignations/useAssignation';
import {
  VerticalStepper,
  Loader,
  Stack,
  Box,
  ContextContainer,
  Button,
} from '@bubbles-ui/components';
import useClassData from '@assignables/hooks/useClassData';
import { getFileUrl } from '@leebrary/helpers/prepareAsset';
import { ChevRightIcon, ChevLeftIcon } from '@bubbles-ui/icons/outline';
import useSteps from './helpers/useSteps';
import TaskDetailHeader from './components/TaskDetailHeader';
import { TaskDetailStyles } from './TaskDetails.style';
import Sidebar from './components/Sidebar';
import updateStudentRequest from '../../../request/instance/updateStudent';

// import useGetSteps from './helpers/useGetSteps';
// import updateStudentRequest from '../../../request/instance/updateStudent';
// import useInstance from './helpers/useInstance';
// import useTask from './helpers/useTask';

async function updateTimestamps(assignation, timestamps) {
  if (timestamps) {
    try {
      await updateStudentRequest({
        instance: assignation?.instance?.id,
        student: assignation.user,
        timestamps: {
          [timestamps]: Date.now(),
        },
      });
    } catch (e) {
      // TODO: Handle error
    }
  }
}

function getNextButtonLabel(step, isLastStep) {
  if (typeof step?.next === 'string') {
    return step?.next;
  }

  if (isLastStep) {
    return 'Finish';
  }

  return 'Continue';
}

export default function TaskDetail({ id, student }) {
  const [assignation, error, loading] = useAssignation(id, student, true);
  const asset = assignation?.instance?.assignable?.asset;
  const coverUrl = useMemo(() => getFileUrl(asset), [asset?.cover]);
  const history = useHistory();

  const steps = useSteps(assignation);

  const [currentStep, setCurrentStep] = useState(0);
  const classData = useClassData(assignation?.instance?.classes);

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
    }
  };

  const { classes } = TaskDetailStyles();

  useEffect(() => {
    if (assignation) {
      updateTimestamps(assignation, 'open');
    }
  }, [assignation]);

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
    <ContextContainer fullHeight spacing={0}>
      <TaskDetailHeader
        asset={asset}
        classData={classData}
        cover={coverUrl}
        isFirstStep={isFirstStep}
        deadline={assignation?.instance?.dates?.deadline}
      />
      <Stack direction="row" className={classes?.root}>
        <Box className={classes?.stepper}>
          <VerticalStepper data={steps} currentStep={currentStep} />
        </Box>
        <Box className={classes?.content}>
          {step?.component}
          <Stack direction="row" justifyContent="space-between" fullWidth className={classes?.nav}>
            {!isFirstStep && step?.previous !== false && (
              <Button
                rounded
                compact
                variant="light"
                leftIcon={<ChevLeftIcon height={20} width={20} />}
                onClick={handlePrev}
              >
                {typeof step?.previous === 'string' ? step?.previous : 'Previous'}
              </Button>
            )}
            {step?.next !== false && (
              <Button
                rightIcon={<ChevRightIcon height={20} width={20} />}
                onClick={handleNext}
                rounded
              >
                {getNextButtonLabel(step, isLastStep)}
              </Button>
            )}
          </Stack>
        </Box>
        <Sidebar
          show={steps[currentStep]?.sidebar === true}
          // show={false}
          assignation={assignation}
          className={classes?.sidebar}
        />
      </Stack>
    </ContextContainer>
  );

  // return (
  //   <>
  //     <Box >
  //       <TaskHeader title={asset?.name} {...classData} />;
  //       <HeaderBackground
  //         withGradient={true}
  //         withBlur={true}
  //         image={getFileUrl(asset.cover)}
  //         styles={{ position: 'absolute' }}
  //         backgroundPosition="center"
  //         withOverlay
  //         blur={10}
  //       />
  //     </Box>
  //   </>
  // );
  // return (
  //   <ContextContainer>
  //     {/* TRANSLATE: Task name */}
  //     <AdminPageHeader values={{ title: asset?.name }} />

  //     {steps[currentStep]?.component}
  //     <Button onClick={() => setCurrentStep((s) => (s > 0 ? s - 1 : 0))}>Previous</Button>
  //     <Button onClick={() => setCurrentStep((s) => (s < s.length - 1 ? s + 1 : s.length - 1))}>
  //       Next
  //     </Button>

  //     {/* <VerticalStepperContainer>
  //       <VerticalStepper data={steps} currentStep={currentStep} />
  //     </VerticalStepperContainer> */}
  //   </ContextContainer>
  // );
  // const instance = useInstance(id);
  // const task = useTask(instance?.task?.id, ['name']);

  // useEffect(async () => {
  //   if (instance) {
  //     await updateStudentRequest({
  //       instance: id,
  //       student,
  //       key: 'opened',
  //       value: new Date().getTime(),
  //     });
  //   }
  // }, [instance, student]);

  // const steps = useGetSteps(id, task?.id, student);

  // if (!task) {
  //   return <Loader />;
  // }

  // if (task?.error) {
  //   return (
  //     <PageContainer>
  //       {/* TRANSLATE: Task detail title */}
  //       <AdminPageHeader title="Task Detail" />
  //       <ContextContainer>
  //         <Text>{task.error}</Text>
  //       </ContextContainer>
  //     </PageContainer>
  //   );
  // }
}

TaskDetail.propTypes = {
  id: PropTypes.string.isRequired,
  student: PropTypes.string.isRequired,
};
