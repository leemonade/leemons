import React from 'react';
import {
  ContextContainer,
  PageContainer,
  VerticalStepper,
  Text,
  Loader,
  Button,
  VerticalStepperContainer,
  Box,
} from '@bubbles-ui/components';
import { HeaderBackground, TaskHeader, TaskDeadline } from '@bubbles-ui/leemons';
import { TaskDetailHeaderStyles } from './TaskDetailHeader.style';

export default function TaskDetailHeader({ asset, classData, cover, isFirstStep, deadline }) {
  const { classes, cx } = TaskDetailHeaderStyles({ isFirstStep }, { name: 'TaskDoing' });

  return (
    <Box className={classes.root}>
      <Box className={classes.header}>
        <TaskHeader
          title={asset?.name}
          subtitle={classData?.name}
          icon={classData?.icon}
          color={classData?.color}
          className={classes.taskHeader}
          size={isFirstStep ? 'md' : 'sm'}
        />
        <HeaderBackground
          styles={{
            position: 'absolute',
            zIndex: -1,
          }}
          withOverlay
          image={cover}
          backgroundPosition="center"
        />
        {deadline && (
          <TaskDeadline
            label="Entrega"
            deadline={deadline instanceof Date ? deadline : new Date(deadline)}
            styles={{
              right: 21,
              position: 'absolute',
              top: 8,
            }}
            size={isFirstStep ? 'md' : 'sm'}
          />
        )}
      </Box>
      <Box className={classes.mainContent}>
        <Box className={classes.verticalStepper}>
          {/* <VerticalStepper {...mock.verticalStepper} currentStep={currentStep} /> */}
        </Box>
        {/* <Box className={classes.pages}>{mock.pages[currentStep](classes, nextStep, prevStep)}</Box> */}
      </Box>
    </Box>
  );
}
