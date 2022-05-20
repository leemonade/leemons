import React from 'react';
import { Box, VerticalStepper, COLORS } from '@bubbles-ui/components';
import { HeaderBackground, TaskHeader, TaskDeadline } from '@bubbles-ui/leemons';
import { mock } from './mock/mock';
import { TaskDoingStyles } from './TaskDoing.styles';
import { TASK_DOING_DEFAULT_PROPS, TASK_DOING_PROP_TYPES } from './TaskDoing.constants';

const TaskDoing = ({ ...props }) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const isFirstStep = currentStep === 0;

  const nextStep = () => {
    const nextStep = currentStep + 1;
    const isLastStep = nextStep === mock.pages.length;
    setCurrentStep(isLastStep ? 0 : nextStep);
  };

  const prevStep = () => {
    const nextStep = currentStep - 1;
    const isFirstStep = nextStep === -1;
    setCurrentStep(isFirstStep ? mock.pages.length : nextStep);
  };

  const taskDeadlineProps = {
    ...mock.taskDeadline,
    styles: { ...mock.taskDeadline.styles, right: isFirstStep ? 8 : 0 },
  };

  const taskHeaderProps = {
    ...mock.taskHeader,
    styles: {
      ...mock.taskHeader.styles,
      right: isFirstStep && '50%',
      borderRadius: isFirstStep ? '16px 16px 0 0' : 0,
      backgroundColor: isFirstStep ? COLORS.mainWhite : COLORS.interactive03,
    },
  };

  const { classes, cx } = TaskDoingStyles({ isFirstStep }, { name: 'TaskDoing' });
  return (

  );
};

TaskDoing.defaultProps = TASK_DOING_DEFAULT_PROPS;
TaskDoing.propTypes = TASK_DOING_PROP_TYPES;

export { TaskDoing };
