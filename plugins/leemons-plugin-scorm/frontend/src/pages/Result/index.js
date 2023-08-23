import React, { useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';

import {
  ActivityAccordion,
  ActivityAccordionPanel,
  Badge,
  Box,
  Button,
  ContextContainer,
  createStyles,
  ImageLoader,
  Loader,
  ScoreFeedback,
  Stack,
  Table,
  Text,
  Title,
} from '@bubbles-ui/components';
import { CutStarIcon, PluginComunicaIcon, StarIcon } from '@bubbles-ui/icons/solid';
import { LocaleDuration } from '@common';
import hooks from 'leemons-hooks';

import { ChatDrawer } from '@comunica/components';
import { getNearestScale } from '@scorm/helpers/getNearestScale';
import { getScormDuration } from '@scorm/helpers/getScormDuration';
import { getScormProgress } from '@scorm/helpers/getScormProgress';
import { isNumber } from 'lodash';
import { prefixPN } from '@scorm/helpers';
import {
  useEvaluationType,
  useEvaluationTypeLocalizations,
} from '@assignables/hooks/useEvaluationType';
import { useIsStudent, useIsTeacher } from '@academic-portfolio/hooks';
import { useScormQuestions } from '@scorm/hooks/useScormQuestions';
import AssignableUserNavigator from '@assignables/components/AssignableUserNavigator';
import ChatButton from '@comunica/components/ChatButton';
import useAssignation from '@scorm/request/hooks/queries/useAssignation';
import useInstances from '@assignables/requests/hooks/queries/useInstances';
import useProgramEvaluationSystem from '@assignables/hooks/useProgramEvaluationSystem';
import useRolesLocalizations from '@assignables/hooks/useRolesLocalizations';
import useTranslateLoader from '@multilanguage/useTranslateLoader';

const useResultStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      backgroundColor: theme.colors.uiBackground02,
      paddingBottom: theme.spacing[12],
      overflow: 'auto',
    },
    container: {
      width: '100%',
      display: 'flex',
      gap: theme.spacing[10],
    },

    studentSelector: {
      width: '332px',
      marginTop: theme.spacing[6],
    },
    rightContent: {
      width: '100%',
    },
    rightContentTeacher: {
      width: 'calc(100% - 332px)',
    },
    header: {
      textAlign: 'center',
      paddingTop: theme.spacing[6],
      paddingBottom: theme.spacing[6],
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing[2],
    },
    firstTableHeader: {
      paddingLeft: `${theme.spacing[6]}px !important`,
    },
    tableHeader: {
      backgroundColor: theme.colors.interactive03h,
      paddingBottom: theme.spacing[2],
      paddingTop: theme.spacing[6],
      paddingLeft: theme.spacing[5],
    },
    tableCell: {
      paddingLeft: theme.spacing[4],
      paddingRight: theme.spacing[4],
      paddingTop: theme.spacing[5],
      paddingBottom: theme.spacing[5],
    },
    showTestBar: {
      backgroundColor: theme.colors.uiBackground01,
      padding: theme.spacing[4],
      display: 'flex',
      justifyContent: 'end',
    },
    feedbackUser: {
      border: '1px solid',
      borderColor: theme.colors.ui01,
      borderRadius: theme.spacing[1],
      padding: theme.spacing[4],
    },
  };
});

export default function Result() {
  /*
    --- Contexts and styles ----
   */
  const { id, user } = useParams();
  const history = useHistory();
  const isStudent = useIsStudent();
  const isTeacher = useIsTeacher();
  const { classes, cx } = useResultStyles();

  /*
    --- Localizations ---
  */
  const { scorm: scormLabel } = useRolesLocalizations(['scorm']);
  const [t] = useTranslateLoader(prefixPN('scormCorrection'));
  const evaluationTypeLocalizations = useEvaluationTypeLocalizations();

  /*
    --- Data fetching ---
  */
  const { data: instance, isLoading: instanceIsLoading } = useInstances({ id, enabled: !!id });
  const evaluationSystem = useProgramEvaluationSystem(instance, { enabled: !!instance });
  const { data: { assignation, scormStatus: state } = {}, isLoading: assignationIsLoading } =
    useAssignation({
      instance: id,
      user,
      enabled: !!id && !!user,
    });

  /*
    --- Parsed data --
  */
  const evaluationType = useEvaluationType(instance ?? {});
  const evaluationTypeLocalzation = evaluationTypeLocalizations?.[evaluationType];

  const questions = useScormQuestions({ state, assignable: instance?.assignable });
  const tableHeaders = React.useMemo(
    () => [
      {
        Header: t('question'),
        accessor: 'question',
        className: cx(classes.tableHeader, classes.firstTableHeader),
      },
      {
        Header: t('result'),
        accessor: 'result',
        className: classes.tableHeader,
      },
    ],
    [t]
  );
  const tableData = React.useMemo(
    () =>
      questions.questions.map((question, i) => {
        const isAnswered = questions.answers[i] !== undefined;
        const isCorrect = !!questions.answers[i];

        return {
          question: (
            <Box className={classes.tableCell}>
              <Text>{question}</Text>
            </Box>
          ),
          result: isAnswered ? (
            <Box style={{ minWidth: '100px' }} className={classes.tableCell}>
              <Box style={{ width: '20px', height: '20px', position: 'relative' }}>
                <ImageLoader
                  src={
                    isCorrect
                      ? '/public/tests/question-done.svg'
                      : '/public/tests/question-error.svg'
                  }
                />
              </Box>
            </Box>
          ) : (
            <Box style={{ minWidth: '100px' }} className={classes.tableCell}>
              <Box
                sx={(theme) => ({
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: theme.colors.ui01,
                })}
              />
            </Box>
          ),
        };
      }),
    [questions]
  );

  const grade = assignation?.grades?.find((g) => g.type === 'main')?.grade;
  const scale = getNearestScale({
    grade,
    evaluationSystem,
  });

  /*
    --- State ---
  */
  const [room, setRoom] = useState(null);
  const [chatOpened, setChatOpened] = useState(null);
  const [accordionState, setAccordionState] = React.useState(['questions']);

  const progress = getScormProgress({ state });
  const duration = getScormDuration({ state, assignation });

  /*
    --- Handlers ---
  */
  const onUserChange = (newUser) => {
    if (newUser) {
      history.push(`/private/scorm/result/${id}/${newUser}`);
    } else {
      history.push(`/private/scorm/result/${id}`);
    }
  };

  if (instanceIsLoading || !evaluationSystem) {
    return <Loader />;
  }

  return (
    <ContextContainer className={classes.root} fullHeight fullWidth>
      <Box
        sx={(theme) => ({
          width: '100%',
          maxWidth: theme.breakpoints.lg,
          paddingLeft: isTeacher ? 0 : theme.spacing[8],
          paddingRight: theme.spacing[5],
        })}
      >
        <Box className={classes.container}>
          {!!isTeacher && (
            <Box className={classes.studentSelector}>
              <AssignableUserNavigator onChange={onUserChange} value={user} instance={instance} />
            </Box>
          )}
          {!!user && !assignationIsLoading && (
            <Box className={cx(classes.rightContent, { [classes.rightContentTeacher]: isTeacher })}>
              <Box className={classes.header}>
                <Text role="productive">
                  {evaluationTypeLocalzation} {instance.gradable ? <StarIcon /> : <CutStarIcon />}
                </Text>
              </Box>
              <Box className={classes.content}>
                <ScoreFeedback
                  calification={{
                    minimumGrade: evaluationSystem.minScaleToPromote.number,
                    grade: scale?.grade,
                    label: scale?.letter,
                    showOnlyLabel: false,
                  }}
                >
                  <Stack
                    fullWidth
                    fullHeight
                    direction="column"
                    justifyContent="center"
                    style={{
                      padding: 24,
                    }}
                  >
                    <Text size="md" role="productive" strong>
                      {scormLabel?.singular}
                    </Text>
                    <Title order={3}>{instance.assignable.asset.name}</Title>
                    <Box
                      sx={(theme) => ({
                        display: 'flex',
                        flexDirection: 'row',
                        gap: theme.other.global.spacing.gap.sm,
                      })}
                    >
                      {isNumber(progress) && (
                        <Text role="productive">
                          {progress}% {t('completed')}
                        </Text>
                      )}
                      {!!duration && (
                        <Text role="productive">
                          (<LocaleDuration seconds={duration} />)
                        </Text>
                      )}
                      {!instance?.gradable && <Text role="productive">-</Text>}
                      {!instance?.gradable && isStudent && (
                        <Link
                          to={instance?.assignable?.roleDetails?.studentDetailUrl
                            ?.replace(':id', id)
                            ?.replace(':user', user)}
                        >
                          {t('repeat')}
                        </Link>
                      )}
                    </Box>
                  </Stack>
                </ScoreFeedback>
                {!!questions.questions.length && (
                  <ActivityAccordion multiple value={accordionState} onChange={setAccordionState}>
                    <ActivityAccordionPanel
                      key={1}
                      itemValue="questions"
                      label={t('questions')}
                      rightSection={
                        <Box>
                          <Badge
                            label={questions?.questions?.length}
                            size="md"
                            color="stroke"
                            closable={false}
                          />
                        </Box>
                      }
                      icon={
                        <Box style={{ position: 'relative', width: '22px', height: '24px' }}>
                          <ImageLoader
                            className="stroke-current"
                            src={'/public/tests/questions-icon.svg'}
                          />
                        </Box>
                      }
                    >
                      <Box>
                        <Table columns={tableHeaders} data={tableData} />
                      </Box>
                    </ActivityAccordionPanel>
                  </ActivityAccordion>
                )}
              </Box>
              <Box sx={(theme) => ({ marginTop: theme.spacing[10] })}>
                <ContextContainer alignItems="center">
                  <Text size="md" color="primary" strong>
                    {isTeacher ? t('chatTeacherDescription') : t('chatDescription')}
                  </Text>
                  <Box>
                    <Button
                      rounded
                      rightIcon={<PluginComunicaIcon />}
                      onClick={() => {
                        hooks.fireEvent('chat:onRoomOpened', room);
                        setChatOpened(true);
                      }}
                    >
                      {isTeacher ? t('chatButtonStudent') : t('chatButtonTeacher')}
                    </Button>
                  </Box>
                </ContextContainer>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {!assignationIsLoading && (
        <>
          <ChatDrawer
            onClose={() => {
              hooks.fireEvent('chat:closeDrawer');
              setChatOpened(false);
            }}
            opened={chatOpened}
            onRoomLoad={(newRoom) => {
              setRoom(newRoom);
            }}
            onMessage={() => {
              setRoom((r) => ({ ...r, unreadMessages: r.unreadMessages + 1 }));
            }}
            onMessagesMarkAsRead={() => {
              setRoom((r) => ({ ...r, unreadMessages: 0 }));
            }}
            room={`plugins.assignables.subject|${instance?.subjects?.[0]?.subject}.assignation|${assignation.id}.userAgent|${user}`}
          />
        </>
      )}
    </ContextContainer>
  );
}
