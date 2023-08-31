import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import {
  ActivityAccordion,
  ActivityAccordionPanel,
  Badge,
  Box,
  Button,
  ContextContainer,
  ScoreInput,
  Text,
} from '@bubbles-ui/components';
import { PluginComunicaIcon, RatingStarIcon } from '@bubbles-ui/icons/outline';
import { TextEditorInput } from '@bubbles-ui/editors';
import ChatDrawer from '@comunica/components/ChatDrawer/ChatDrawer';
import ChatButton from '@comunica/components/ChatButton';
import { useStore } from '@common';
import { findNearestFloorScore } from '@assignables/widgets/dashboard/nya/components/EvaluationCard/components/ScoreFeedback';

function Grades({ classes, evaluationSystem, scoreInputProps, control, subject, user }) {
  const formKey = `${user}.${subject}.score`;

  const score = useWatch({ control, name: formKey });
  const scale = useMemo(() => findNearestFloorScore(score, evaluationSystem.scales), [score]);

  return (
    <Box className={classes.accordionPanel}>
      {evaluationSystem && scoreInputProps && (
        <Controller
          key={formKey}
          control={control}
          name={formKey}
          render={({ field }) => (
            <ScoreInput
              {...scoreInputProps}
              tags={[]}
              value={scale ? { score: scale.number, letter: scale.letter } : undefined}
              decimalPrecision={2}
              decimalSeparator=","
              direction="ltr"
              onChange={(newValue) => field.onChange(newValue.score)}
            />
          )}
        />
      )}
    </Box>
  );
}

Grades.propTypes = {
  classes: PropTypes.object.isRequired,
  evaluationSystem: PropTypes.object,
  scoreInputProps: PropTypes.object,
  control: PropTypes.object,
  subject: PropTypes.string,
};

function Feedback({ classes, subject, control, user }) {
  return (
    <Box className={classes.accordionPanel}>
      <Controller
        key={`${user}.${subject}.feedback`}
        control={control}
        name={`${user}.${subject}.feedback`}
        render={({ field }) => <TextEditorInput {...field} />}
      />
    </Box>
  );
}

Feedback.propTypes = {
  classes: PropTypes.object.isRequired,
  subject: PropTypes.string,
  control: PropTypes.object,
  user: PropTypes.string,
};

export default function Accordion({
  labels,
  evaluationSystem,
  classes,
  scoreInputProps,
  subject,
  user,
  instance,
  context,
  assignationId,
}) {
  const [store, render] = useStore();
  const { control } = useFormContext();
  const { tabsState, updateTabState } = useContext(context);

  const state = tabsState(subject);
  const setState = updateTabState(subject);

  // EN: Start with the accordion opened
  // ES: Iniciar con el acordeón abierto
  const initialState = useMemo(() => {
    const defaultState = [labels?.punctuation];
    if (!state) {
      setState(defaultState);
      return defaultState;
    }

    return state;
  }, []);

  const Chat = (
    <>
      {store.room ? (
        <Box sx={(theme) => ({ marginTop: theme.spacing[10], marginBottom: theme.spacing[10] })}>
          <ContextContainer alignItems="center">
            <Text size="md" color="primary" strong>
              {labels?.chatTeacherDescription}
            </Text>
            <Box>
              <Button
                rounded
                rightIcon={<PluginComunicaIcon />}
                onClick={() => {
                  store.chatOpened = true;
                  render();
                }}
              >
                {labels?.chatButtonStudent}
              </Button>
            </Box>
          </ContextContainer>
        </Box>
      ) : null}

      <ChatDrawer
        onClose={() => {
          store.chatOpened = false;
          render();
        }}
        opened={store.chatOpened}
        onRoomLoad={(room) => {
          store.room = room;
          render();
        }}
        onMessage={() => {
          store.room.unreadMessages += 1;
          render();
        }}
        onMessagesMarkAsRead={() => {
          store.room.unreadMessages = 0;
          render();
        }}
        room={`plugins.assignables.subject|${subject}.assignation|${assignationId}.userAgent|${user}`}
      />
    </>
  );

  return (
    <>
      <ActivityAccordion noFlex onChange={setState} value={state || initialState}>
        {!!instance.requiresScoring && (
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
            <Grades
              classes={classes}
              evaluationSystem={evaluationSystem}
              scoreInputProps={scoreInputProps}
              control={control}
              subject={subject}
              user={user}
            />
          </ActivityAccordionPanel>
        )}
      </ActivityAccordion>
      {!!instance?.allowFeedback && Chat}
    </>
  );
}

Accordion.propTypes = {
  labels: PropTypes.object,
  evaluationSystem: PropTypes.object,
  classes: PropTypes.object,
  scoreInputProps: PropTypes.object,
  instance: PropTypes.object,
  subject: PropTypes.string,
  context: PropTypes.object,
  user: PropTypes.string,
  assignationId: PropTypes.string,
};
