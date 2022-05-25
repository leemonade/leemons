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
import _ from 'lodash';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import useSteps from './helpers/useSteps';
import TaskDetailHeader from './components/TaskDetailHeader';
import { TaskDetailStyles } from './TaskDetail.style';
import Sidebar from './components/Sidebar';
import updateStudentRequest from '../../../request/instance/updateStudent';
import { prefixPN } from '../../../helpers';

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

function getNextButtonLabel(step, isLastStep, labels) {
  if (typeof step?.next === 'string') {
    return step?.next;
  }

  if (isLastStep) {
    return labels.finish;
  }

  return labels.next;
}

export default function TaskDetail({ id, student }) {
  const [assignation, error, loading] = useAssignation(id, student, true);
  const asset = assignation?.instance?.assignable?.asset;
  const coverUrl = useMemo(() => getFileUrl(asset?.cover), [asset?.cover]);
  const history = useHistory();

  const [, translations] = useTranslateLoader(prefixPN('task_realization'));

  const labels = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = _.get(res, prefixPN('task_realization'));

      // EN: Modify the data object here
      // ES: Modifica el objeto data aquí
      return data;
    }

    return {};
  }, [translations]);

  const steps = useSteps(assignation, labels);

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
                {typeof step?.previous === 'string' ? step?.previous : labels?.buttons?.previous}
              </Button>
            )}
            {step?.next !== false && (
              <Button
                rightIcon={<ChevRightIcon height={20} width={20} />}
                onClick={handleNext}
                rounded
              >
                {getNextButtonLabel(step, isLastStep, labels?.buttons)}
              </Button>
            )}
          </Stack>
        </Box>
        <Sidebar
          show={steps[currentStep]?.sidebar === true}
          assignation={assignation}
          className={classes?.sidebar}
          labels={labels?.sidebar}
        />
      </Stack>
    </ContextContainer>
  );
}

TaskDetail.propTypes = {
  id: PropTypes.string.isRequired,
  student: PropTypes.string.isRequired,
};
