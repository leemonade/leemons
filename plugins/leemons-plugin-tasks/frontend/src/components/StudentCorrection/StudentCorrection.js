import useProgramEvaluationSystem from '@assignables/hooks/useProgramEvaluationSystem';
import {
  ActivityAccordion,
  ActivityAccordionPanel,
  Box,
  Button,
  ContextContainer,
  HtmlText,
  ScoreFeedback,
  Text,
  Title,
} from '@bubbles-ui/components';
import { PluginComunicaIcon } from '@bubbles-ui/icons/outline';
import { unflatten, useStore } from '@common';
import ChatDrawer from '@comunica/components/ChatDrawer/ChatDrawer';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import _ from 'lodash';
import React, { useMemo } from 'react';
import { prefixPN } from '../../helpers';
import SubjectTabs from '../Correction/components/SubjectTabs';
import Submission from '../Correction/components/Submission';
import studentCorrectionStyles from './StudentCorrection.style';
import ContactTeacher from './components/ContactTeacher/ContactTeacher';

function SubjectTab({ assignation, subject, labels, classes, evaluationSystem }) {
  const [store, render] = useStore();
  const grade = assignation?.grades?.find(({ subject: s }) => s === subject);

  const scale = evaluationSystem?.scales?.find(({ number }) => number === grade?.grade);

  const Chat = (
    <>
      {store.room ? (
        <Box sx={(theme) => ({ marginTop: theme.spacing[10], marginBottom: theme.spacing[10] })}>
          <ContextContainer alignItems="center">
            <Text size="md" color="primary" strong>
              {labels?.chatDescription}
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
                {labels?.chatButtonTeacher}
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
        room={`plugins.assignables.subject|${subject}.assignation|${assignation.id}.userAgent|${assignation.user}`}
      />
    </>
  );

  if (!scale) {
    return (
      <>
        <Box className={classes?.notCorrected}>
          <Text>{labels?.subjectNotCorrectedYet}</Text>
        </Box>
        {Chat}
      </>
    );
  }
  return (
    <>
      <ScoreFeedback
        calification={{
          grade: scale.number,
          label: scale.letter,
          showOnlyLabel: !!scale.letter,
          minimumGrade: evaluationSystem.minScaleToPromote?.number,
        }}
      >
        <Box className={classes?.scoreFeedbackContent}>
          <Title order={4} color="secondary">
            Task
          </Title>
          <Title order={3} color="primary">
            {assignation?.instance?.assignable?.asset?.name}
          </Title>
        </Box>
      </ScoreFeedback>
      {!store.room ? (
        <>
          {grade?.feedback && (
            <ActivityAccordion>
              <ActivityAccordionPanel
                label={labels?.feedbackForStudent}
                icon={<PluginComunicaIcon />}
              >
                <Box className={classes?.accordionPanel}>
                  <Box className={classes?.feedbackContainer}>
                    <HtmlText>{grade?.feedback}</HtmlText>
                  </Box>
                </Box>
              </ActivityAccordionPanel>
            </ActivityAccordion>
          )}
          <ContactTeacher
            assignation={assignation}
            subject={subject}
            labels={labels?.contactTeacher}
          />
        </>
      ) : null}
      {Chat}
    </>
  );
}

export default function StudentCorrection({ assignation }) {
  const { classes } = studentCorrectionStyles();

  const [, translations] = useTranslateLoader(prefixPN('task_correction'));

  const labels = useMemo(() => {
    if (translations && translations.items) {
      const res = unflatten(translations.items);
      const data = _.get(res, prefixPN('task_correction'));

      // EN: Modify the data object here
      // ES: Modifica el objeto data aquí
      return data;
    }

    return {};
  }, [translations]);

  const evaluationSystem = useProgramEvaluationSystem(assignation?.instance);

  return (
    <Box className={classes?.root}>
      <Submission assignation={assignation} labels={labels?.submission} />
      <SubjectTabs assignation={assignation} instance={assignation?.instance}>
        <SubjectTab labels={labels} classes={classes} evaluationSystem={evaluationSystem} />
      </SubjectTabs>
    </Box>
  );
}
