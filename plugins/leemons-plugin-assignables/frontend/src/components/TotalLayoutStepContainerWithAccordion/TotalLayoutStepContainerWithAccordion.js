import React from 'react';
import {
  createStyles,
  Stack,
  TotalLayoutStepContainer,
  ActivityAccordion,
  ActivityAccordionPanel,
} from '@bubbles-ui/components';
import { TotalLayoutStepContainerStyles } from '@bubbles-ui/components/lib/layout/TotalLayout/TotalLayoutStepContainer/TotalLayoutStepContainer.styles';
import { TOTAL_LAYOUT_STEP_CONTAINER_WITH_ACCORDION_PROPS } from './TotalLayoutStepContainerWithAccordion.constants';

const TotalLayoutStepContainerWithAccordionStyles = createStyles((theme) => ({
  accordionContent: {
    padding: theme.spacing[5],
    paddingBottom: theme.spacing[2],
    paddingTop: theme.spacing[2],
  },

  noHorizontalPadding: {
    paddingLeft: 0,
    paddingRight: 0,
  },

  noVerticalPadding: {
    paddingTop: 0,
    paddingBottom: 0,
  },
}));
export default function TotalLayoutStepContainerWithAccordion({
  accordion,
  children,
  noHorizontalPadding,
  noVerticalPadding,
  ...props
}) {
  const { classes, cx } = TotalLayoutStepContainerStyles(props);
  const { classes: accordionClasses } = TotalLayoutStepContainerWithAccordionStyles(props);

  return (
    <Stack direction="column" className={cx(classes.stepContainer)}>
      {!!accordion && (
        <ActivityAccordion
          style={{
            backgroundColor: 'white',
            borderBottom: 'none',
          }}
        >
          <ActivityAccordionPanel
            itemValue="0"
            compact
            label={accordion.title}
            icon={accordion.icon}
          >
            <Stack direction="column" className={accordionClasses.accordionContent}>
              {accordion.children}
            </Stack>
          </ActivityAccordionPanel>
        </ActivityAccordion>
      )}
      <TotalLayoutStepContainer {...props} clean>
        <Stack
          direction="column"
          className={cx(classes.formContainer, {
            [accordionClasses.noHorizontalPadding]: noHorizontalPadding,
            [accordionClasses.noVerticalPadding]: noVerticalPadding,
          })}
        >
          {children}
        </Stack>
      </TotalLayoutStepContainer>
    </Stack>
  );
}

TotalLayoutStepContainerWithAccordion.propTypes = TOTAL_LAYOUT_STEP_CONTAINER_WITH_ACCORDION_PROPS;
