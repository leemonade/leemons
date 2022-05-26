import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useFormContext, Controller } from 'react-hook-form';
import {
  Box,
  Text,
  ActivityAccordion,
  ActivityAccordionPanel,
  Badge,
  ContextContainer,
  ScoreInput,
} from '@bubbles-ui/components';
import { PluginComunicaIcon, RatingStarIcon } from '@bubbles-ui/icons/outline';
import { TextEditorInput } from '@bubbles-ui/editors';

export default function Accordion({
  labels,
  evaluationSystem,
  classes,
  scoreInputProps,
  subject,
  context,
}) {
  const { control } = useFormContext();
  const { tabsState, updateTabState } = useContext(context);

  const state = tabsState(subject);
  const setState = updateTabState(subject);

  return (
    <ActivityAccordion noFlex onChange={setState} state={state}>
      <ActivityAccordionPanel
        label={labels?.punctuation}
        icon={<RatingStarIcon />}
        rightSection={
          <Badge
            label={
              <ContextContainer direction="row" spacing={1}>
                <Text>{labels?.minToPromote}</Text>
                <Badge
                  label={
                    evaluationSystem?.minScaleToPromote?.letter ||
                    evaluationSystem?.minScaleToPromote?.number
                  }
                  closable={false}
                  severity="warning"
                />
              </ContextContainer>
            }
            closable={false}
          />
        }
      >
        <Box className={classes.accordionPanel}>
          {evaluationSystem && scoreInputProps && (
            <Controller
              key={`${subject}.score`}
              control={control}
              name={`${subject}.score`}
              render={({ field }) => (
                <ScoreInput
                  {...scoreInputProps}
                  value={{ score: field?.value }}
                  onChange={(newValue) => field.onChange(newValue.score)}
                />
              )}
            />
          )}
        </Box>
      </ActivityAccordionPanel>
      <ActivityAccordionPanel
        label={labels?.feedbackForStudent}
        icon={<PluginComunicaIcon />}
        rightSection={<Badge label={labels?.optional} closable={false} />}
      >
        <Box className={classes.accordionPanel}>
          <Controller
            key={`${subject}.feedback`}
            control={control}
            name={`${subject}.feedback`}
            render={({ field }) => <TextEditorInput {...field} />}
          />
        </Box>
      </ActivityAccordionPanel>
    </ActivityAccordion>
  );
}

Accordion.propTypes = {
  labels: PropTypes.object,
  evaluationSystem: PropTypes.object,
  classes: PropTypes.object,
  scoreInputProps: PropTypes.object,
  subject: PropTypes.string,
  context: PropTypes.object,
};
