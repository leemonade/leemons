import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { isNil, map } from 'lodash';
import { useHistory } from 'react-router-dom';
import { useForm, Controller, useWatch } from 'react-hook-form';
import {
  Box,
  TotalLayoutContainer,
  TotalLayoutStepContainer,
  Stack,
  ContextContainer,
  NumberInput,
  VerticalContainer,
  Text,
  Select,
  Tabs,
  TabPanel,
  Button,
} from '@bubbles-ui/components';
import { TextEditorInput } from '@bubbles-ui/editors';
import { PluginComunicaIcon, SendMessageIcon } from '@bubbles-ui/icons/outline';
import ActivityHeader from '@assignables/components/ActivityHeader';
import AssignableUserNavigator from '@assignables/components/AssignableUserNavigator';
import useProgramEvaluationSystem from '@assignables/hooks/useProgramEvaluationSystem';
import useStudentAssignationMutation from '@tasks/hooks/student/useStudentAssignationMutation';
import { useUserAgentsInfo } from '@users/hooks';
import { useClassesSubjects } from '@academic-portfolio/hooks';
import { SubjectItemDisplay } from '@academic-portfolio/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@tasks/helpers';
import hooks from 'leemons-hooks';
import { AssetEmbedList } from '@leebrary/components/AssetEmbedList';
import { addSuccessAlert } from '@layout/alert';
import { ChatDrawer } from '@comunica/components';
import EvaluationFeedback from '@assignables/components/EvaluationFeedback/EvaluationFeedback';
import ConditionalInput from '../Inputs/ConditionalInput';
import LinkSubmission from './components/LinkSubmission/LinkSubmission';

function useLetterEvaluationData({ evaluationSystem }) {
  return useMemo(() => {
    if (evaluationSystem?.type !== 'letter') {
      return null;
    }

    return evaluationSystem.scales
      .map((scale) => ({
        label: scale.letter,
        value: scale.number,
      }))
      .sort((a, b) => a.value - b.value);
  }, [evaluationSystem]);
}

function useOnEvaluationChange({ form, instance, assignation, subject }) {
  const { requiresScoring } = instance ?? {};
  const { score: _score, feedback: _feedback, showFeedback } = useWatch({ control: form.control });

  const score = isNil(_score) ? null : Number(_score);
  const feedback = !showFeedback || isNil(_feedback) ? null : _feedback;

  const previousScore = useMemo(
    () => assignation?.grades?.find((grade) => grade.type === 'main' && grade.subject === subject),
    [assignation?.grades, subject]
  );

  const { mutateAsync } = useStudentAssignationMutation();

  /*
    === Save new score ===
  */
  const onSave = ({ visibleToStudent }) => {
    const { score, feedback, showFeedback } = form.getValues();

    if (subject && (!isNil(score) || !requiresScoring)) {
      const gradeObj = {
        subject,
        grade: isNil(score) ? null : Number(score),
        feedback: showFeedback ? feedback : null,
        type: 'main',
        visibleToStudent: !!visibleToStudent,
      };

      return mutateAsync({
        instance: instance.id,
        student: assignation.user,
        grades: [gradeObj],
      });
    }
  };

  /*
    === Update score ===
  */
  useEffect(() => {
    const gradeObj = previousScore;
    const { grade, feedback: savedFeedback } = gradeObj ?? {};

    const gradeIsDirty = form.getFieldState('grade').isDirty;
    const feedbackIsDirty = form.getFieldState('feedback').isDirty;

    if (!gradeIsDirty && !isNil(grade) && grade !== score) {
      form.setValue('score', grade);
    }

    if (!feedbackIsDirty && savedFeedback !== feedback) {
      form.setValue('feedback', savedFeedback);
      if (savedFeedback) {
        form.setValue('showFeedback', true);
      }
    }
  }, [previousScore]);

  return onSave;
}

function CorrectionSubjectTab({ assignation, instance, subject }) {
  const [t] = useTranslateLoader(prefixPN('task_correction.teacher'));
  const form = useForm();

  const [loading, setLoading] = useState(false);
  const [chatOpened, setChatOpened] = useState(false);

  const room = `assignables.subject|${subject}.assignation|${assignation?.id}.userAgent|${assignation?.user}`;

  const evaluationSystem = useProgramEvaluationSystem(instance);
  const data = useLetterEvaluationData({ evaluationSystem });

  const publish = useOnEvaluationChange({ form, instance, assignation, subject });

  if (instance.dates.evaluationClosed) {
    return (
      <EvaluationFeedback
        assignation={assignation}
        onChatClick={() => {
          hooks.fireEvent('chat:onRoomOpened', room);
          setChatOpened(true);
        }}
        subject={subject}
      />
    );
  }

  return (
    <ContextContainer title={t('evaluation')} spacing={8}>
      {!!instance?.requiresScoring && (
        <Box sx={{ maxWidth: 212 }}>
          <Controller
            name="score"
            control={form.control}
            render={({ field }) => {
              if (evaluationSystem?.type === 'numeric') {
                return (
                  <NumberInput
                    {...field}
                    label={t('score_placeholder')}
                    min={evaluationSystem?.minScale?.number}
                    max={evaluationSystem?.maxScale?.number}
                  />
                );
              }
              return (
                <Select
                  {...field}
                  searchable
                  data={data}
                  label={t('score_label')}
                  placeholder={t('score_placeholder')}
                />
              );
            }}
          />
        </Box>
      )}
      {!!instance?.allowFeedback && (
        <Controller
          name="showFeedback"
          control={form.control}
          render={({ field: showFeedbackField }) => (
            <Controller
              name="feedback"
              control={form.control}
              render={({ field }) => (
                <ConditionalInput
                  {...showFeedbackField}
                  checked={!!showFeedbackField.value}
                  label={t('add_feedback')}
                  render={() => <TextEditorInput {...field} />}
                />
              )}
            />
          )}
        />
      )}
      <Stack justifyContent="end" spacing={4}>
        <Button
          variant="link"
          onClick={() => {
            hooks.fireEvent('chat:onRoomOpened', room);
            setChatOpened(true);
          }}
          rightIcon={<PluginComunicaIcon />}
        >
          {t('comunica')}
        </Button>
        <Button
          loading={loading}
          onClick={async () => {
            setLoading(true);
            setTimeout(async () => {
              try {
                await publish({ visibleToStudent: true });
                addSuccessAlert(t('publish_success'));
              } finally {
                setLoading(false);
              }
            }, 100);
          }}
          rightIcon={<SendMessageIcon />}
        >
          {t('publish')}
        </Button>
      </Stack>

      {!loading ? (
        <>
          <ChatDrawer
            onClose={() => {
              hooks.fireEvent('chat:closeDrawer');
              setChatOpened(false);
            }}
            opened={chatOpened}
            room={room}
          />
        </>
      ) : null}
    </ContextContainer>
  );
}

CorrectionSubjectTab.propTypes = {
  assignation: PropTypes.object.isRequired,
  instance: PropTypes.object.isRequired,
  subject: PropTypes.string.isRequired,
};

export default function Correction({ assignation, instance }) {
  const [t] = useTranslateLoader(prefixPN('task_correction.teacher'));
  const scrollRef = useRef();
  const history = useHistory();

  const subjects = useClassesSubjects(instance?.classes);

  const submission = useMemo(
    () => map(assignation?.metadata?.submission, 'id'),
    [assignation?.metadata?.submission]
  );

  const { data: userAgentInfo } = useUserAgentsInfo(assignation?.user, {
    select: (users) => users?.[0] ?? null,
  });
  const onChangeUser = (user) => {
    if (user) {
      history.push(`/private/tasks/correction/${instance?.id}/${user ?? null}`);
    }
  };

  return (
    <TotalLayoutContainer
      scrollRef={scrollRef}
      Header={
        <ActivityHeader
          instance={instance}
          showClass
          showRole
          showEvaluationType
          showDeadline
          action={t('evaluation')}
        />
      }
    >
      <VerticalContainer
        scrollRef={scrollRef}
        leftZone={
          <>
            <Box sx={(theme) => ({ marginBottom: theme.spacing[1] })}>
              <Text>{t('student')}</Text>
            </Box>
            <AssignableUserNavigator
              onlySelect
              onChange={onChangeUser}
              value={assignation.user}
              instance={instance}
            />
          </>
        }
      >
        <TotalLayoutStepContainer
          stepName={
            userAgentInfo?.user
              ? `${userAgentInfo.user.name ?? ''} ${userAgentInfo.user.surnames ?? ''}`
              : null
          }
        >
          <Stack direction="column" spacing={8}>
            {instance?.assignable?.submission?.type === 'File' && (
              <Box>
                <ContextContainer title={t('submission')}>
                  <AssetEmbedList assets={submission} />
                </ContextContainer>
              </Box>
            )}
            {instance?.assignable?.submission?.type === 'Link' && (
              <Box>
                <ContextContainer title={t('submission')}>
                  <LinkSubmission assignation={assignation} />
                </ContextContainer>
              </Box>
            )}

            <Box>
              {subjects?.length === 1 && (
                <CorrectionSubjectTab
                  assignation={assignation}
                  instance={instance}
                  subject={subjects[0].id}
                  key={`${assignation?.id}-${subjects[0].id}`}
                />
              )}

              {subjects?.length > 1 && (
                <Tabs>
                  {subjects.map((subject) => (
                    <TabPanel
                      key={`${assignation?.id}-${subject.id}`}
                      label={<SubjectItemDisplay subjectsIds={[subject.id]} />}
                    >
                      <ContextContainer
                        sx={(theme) => ({ marginTop: theme.other.global.spacing.padding.lg })}
                      >
                        <CorrectionSubjectTab
                          assignation={assignation}
                          instance={instance}
                          subject={subject.id}
                        />
                      </ContextContainer>
                    </TabPanel>
                  ))}
                </Tabs>
              )}
            </Box>
          </Stack>
        </TotalLayoutStepContainer>
      </VerticalContainer>
    </TotalLayoutContainer>
  );
}

Correction.propTypes = {
  assignation: PropTypes.object.isRequired,
  instance: PropTypes.object.isRequired,
};
