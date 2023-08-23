import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  createStyles,
  HtmlText,
  Title,
  Paper,
  useResizeObserver,
} from '@bubbles-ui/components';
import { ChevLeftIcon, ChevRightIcon } from '@bubbles-ui/icons/outline';
import { TextEditorViewer } from '@common/components';
import dayjs from 'dayjs';
import LimitedTimeAlert from '../../../LimitedTimeAlert';
import { AnimatedPane } from './AnimatedPane';

function _DevelopmentText({ text, style, classes }, ref) {
  if (!text) {
    return null;
  }

  return (
    <Paper
      className={classes.developmentText}
      shadow="level01"
      sx={{
        opacity: style?.opacity,
        transform: `translateX(${style?.translateX || 0}px)`,
        zIndex: style?.zIndex,
      }}
      ref={ref}
      bordered
    >
      <TextEditorViewer>{text}</TextEditorViewer>
    </Paper>
  );
}

_DevelopmentText.displayName = 'DevelopmentText';

const DevelopmentText = React.forwardRef(_DevelopmentText);

const useDevelopmentStepStyles = createStyles((theme, { marginTop }) => {
  const buttonsHeight = 44;
  const buttonsPaddingTop = theme.spacing[6];
  const buttonsPaddingBottom = theme.spacing[10];
  const buttonContainerHeight = buttonsHeight + buttonsPaddingTop + buttonsPaddingBottom;

  return {
    root: {
      height: `calc(100vh - ${marginTop + buttonContainerHeight}px)`,
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing[5],
    },
    developmentContainer: {
      position: 'relative',
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      gap: theme.spacing[3],
    },
    developmentText: {
      height: '100%',
      width: '100%',
      overflowY: 'auto',
      overflowX: 'hidden',
    },
  };
});

export default function DevelopmentStep({
  assignation,
  localizations: _labels,
  setButtons,
  onPrevStep,
  onNextStep,
  hasPrevStep,
  hasNextStep,
  hasDeliverable,
  hasNextActivity,
  index,
  previousIndex,
  marginTop,
  preview,
}) {
  const labels = _labels?.development_step;
  const { development: developments } = assignation.instance.assignable.metadata;
  const developmentLength = developments?.length;
  const [step, setStep] = React.useState(previousIndex < index ? 0 : developmentLength - 1);
  const [animation, setAnimation] = React.useState(null);

  const followingStepAfterAnimation = animation === 'backward' ? step - 1 : step + 1;

  const hasNextDevelopment = step < developmentLength - 1;
  const hasPrevDevelopment = step > 0;

  const [ref, rect] = useResizeObserver();

  const now = dayjs();
  const startDate = dayjs(assignation?.instance?.dates?.start || null);
  const canSubmit =
    assignation?.instance?.alwaysAvailable || (startDate.isValid() && !now.isBefore(startDate));

  React.useEffect(() => {
    setButtons(
      <>
        <Box>
          {hasPrevDevelopment && (
            <Button
              disabled={!!animation}
              onClick={() => setAnimation('backward')}
              variant={animation ? 'filled' : 'link' /* Use filled when disabled to avoid bugs */}
              rounded={!!animation /* Use rounded when disabled to avoid bugs */}
              leftIcon={<ChevLeftIcon />}
            >
              {_labels?.buttons?.previous}
            </Button>
          )}
          {!hasPrevDevelopment && hasPrevStep && (
            <Button
              onClick={onPrevStep}
              variant={animation ? 'filled' : 'link' /* Use filled when disabled to avoid bugs */}
              rounded={!!animation /* Use rounded when disabled to avoid bugs */}
              leftIcon={<ChevLeftIcon />}
              disabled={!!animation}
            >
              {_labels?.buttons?.previous}
            </Button>
          )}
        </Box>
        {hasNextDevelopment && (
          <Button
            disabled={!!animation}
            onClick={() => setAnimation('forward')}
            variant="outline"
            rightIcon={<ChevRightIcon />}
            rounded
          >
            {_labels?.buttons?.next}
          </Button>
        )}
        {!hasNextDevelopment && (hasNextStep || !hasNextActivity) && (
          <Button
            onClick={onNextStep}
            variant={hasNextStep ? 'outline' : 'filled'}
            rightIcon={<ChevRightIcon />}
            rounded
            disabled={!!animation || !canSubmit || (!hasNextStep && preview)}
          >
            {hasNextStep ? _labels?.buttons?.next : _labels?.buttons?.finish}
          </Button>
        )}
        {!hasNextDevelopment && !hasNextStep && hasNextActivity && (
          <Button
            variant="filled"
            rightIcon={<ChevRightIcon />}
            disabled={!!animation || !canSubmit}
            rounded
            onClick={onNextStep}
          >
            {_labels?.buttons?.nextActivity}
          </Button>
        )}
      </>
    );
  }, [
    setButtons,
    onPrevStep,
    onNextStep,
    hasPrevStep,
    hasNextStep,
    hasNextDevelopment,
    hasPrevDevelopment,
    step,
    _labels?.buttons,
    hasNextActivity,
    animation,

    canSubmit,
  ]);

  const { classes, theme } = useDevelopmentStepStyles({ marginTop });

  const textWidth = rect.width;
  const gap = theme.spacing[3];

  return (
    <Box className={classes.root}>
      <Title color="primary" order={2}>
        {labels?.development}{' '}
        {developmentLength > 1 &&
          `(${(animation ? followingStepAfterAnimation : step) + 1}/${developmentLength})`}
      </Title>
      <Box className={classes.developmentContainer}>
        <AnimatedPane
          variant="primaryPane"
          animating={!!animation}
          reversed={animation === 'backward'}
          width={textWidth}
          gap={gap}
          onAnimationEnd={() => {
            setAnimation(null);
            setStep((s) => (animation === 'backward' ? s - 1 : s + 1));
          }}
        >
          <DevelopmentText
            ref={ref}
            classes={classes}
            text={developments?.[step]?.development}
            key={step}
          />
        </AnimatedPane>
        {!!animation && (
          <AnimatedPane
            variant="secondaryPane"
            animating={!!animation}
            reversed={animation === 'backward'}
            width={textWidth}
            gap={gap}
          >
            <DevelopmentText
              classes={classes}
              text={
                animation === 'backward'
                  ? developments?.[step - 1]?.development
                  : developments?.[step + 1]?.development
              }
              key={animation === 'backward' ? step - 1 : step + 1}
            />
          </AnimatedPane>
        )}
      </Box>
      <LimitedTimeAlert
        assignation={assignation}
        labels={_labels?.limitedTimeAlert}
        show={
          hasDeliverable &&
          ((!animation && !hasNextDevelopment) ||
            (animation && followingStepAfterAnimation === developmentLength - 1))
        }
      />
    </Box>
  );
}

DevelopmentStep.propTypes = {
  assignation: PropTypes.shape({
    instance: PropTypes.shape({
      assignable: PropTypes.shape({
        development: PropTypes.string,
      }),
    }),
  }),
  labels: PropTypes.shape({
    development_step: PropTypes.shape({
      development: PropTypes.string,
    }),
  }),
};
