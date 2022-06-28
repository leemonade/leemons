import React, { useContext, useMemo } from 'react';
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
  instance,
  context,
}) {
  const { control } = useFormContext();
  const { tabsState, updateTabState } = useContext(context);

  const state = tabsState(subject);
  const setState = updateTabState(subject);

  // EN: Start with the accordion opened
  // ES: Iniciar con el acordeón abierto
  const initialState = useMemo(() => {
    const defaultState = {
      0: true,
      1: true,
    };
    if (!state) {
      setState(defaultState);
      return defaultState;
    }

    return state;
  }, []);

  if (instance?.requiresScoring && instance?.allowFeedback) {
    return (
      <ActivityAccordion noFlex onChange={setState} state={state || initialState}>
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
                    tags={[]}
                    value={{ score: field?.value }}
                    decimalPrecision={2}
                    decimalSeparator=","
                    direction="ltr"
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
  if (instance?.requiresScoring && !instance?.allowFeedback) {
    return (
      <ActivityAccordion noFlex onChange={setState} state={state || initialState}>
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
                    tags={[]}
                    value={{ score: field?.value }}
                    decimalPrecision={2}
                    decimalSeparator=","
                    direction="ltr"
                    onChange={(newValue) => field.onChange(newValue.score)}
                  />
                )}
              />
            )}
          </Box>
        </ActivityAccordionPanel>
      </ActivityAccordion>
    );
  }
  if (!instance?.requiresScoring && instance?.allowFeedback) {
    return (
      <ActivityAccordion noFlex onChange={setState} state={state || initialState}>
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

  return null;
}

Accordion.propTypes = {
  labels: PropTypes.object,
  evaluationSystem: PropTypes.object,
  classes: PropTypes.object,
  scoreInputProps: PropTypes.object,
  subject: PropTypes.string,
  context: PropTypes.object,
};
