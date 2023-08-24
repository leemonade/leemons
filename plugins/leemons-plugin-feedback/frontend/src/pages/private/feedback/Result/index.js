import React from 'react';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@feedback/helpers/prefixPN';
import { htmlToText, useStore } from '@common';
import { useHistory, useParams } from 'react-router-dom';
import {
  ActivityAccordion,
  ActivityAccordionPanel,
  Badge,
  Box,
  Button,
  Stack,
  Switch,
  Text,
  TextClamp,
  Title,
} from '@bubbles-ui/components';
import { getFeedbackRequest, getFeedbackResultsRequest } from '@feedback/request';
import getAssignableInstance from '@assignables/requests/assignableInstances/getAssignableInstance';
import {
  DataFileBarsQuestionIcon,
  DownloadIcon,
  FormImageIcon,
  GaugeDashboardIcon,
  NavigationMenuLeftIcon,
  PluginRankingIcon,
  QuestionExclamationIcon,
} from '@bubbles-ui/icons/outline';
import { NPSStatistics } from '@feedback/pages/private/feedback/Result/components/NPSStatistics';
import { LikertStatistics } from '@feedback/pages/private/feedback/Result/components/LikertStatistics';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { createDatasheet } from '@feedback/helpers/createDatasheet';
import useMutateAssignableInstance from '@assignables/hooks/assignableInstance/useMutateAssignableInstance';
import dayjs from 'dayjs';
import { useIsTeacher } from '@academic-portfolio/hooks';
import ResultStyles from './Result.styles';
import { OpenResponse, SelectResponse } from './components';

const questionsByType = {
  likertScale: <LikertStatistics />,
  singleResponse: <SelectResponse />,
  multiResponse: <SelectResponse />,
  netPromoterScore: <NPSStatistics />,
  openResponse: <OpenResponse />,
};

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

export default function Result() {
  const [t] = useTranslateLoader(prefixPN('feedbackResult'));
  const [store, render] = useStore({
    loading: true,
  });
  const [accordionState, setAccordionState] = React.useState(['info']);

  const { mutateAsync } = useMutateAssignableInstance();

  const { classes } = ResultStyles({}, { name: 'Result' });

  const isTeacher = useIsTeacher();
  const history = useHistory();
  const params = useParams();

  async function init() {
    try {
      store.loading = true;
      render();
      const instance = await getAssignableInstance({ id: params.id });

      const [result, feedback] = await Promise.all([
        getFeedbackResultsRequest(params.id),
        getFeedbackRequest(instance.assignable.id),
      ]);
      store.result = result;
      store.feedback = feedback.feedback;
      store.loading = false;
      store.instanceId = params.id;
      store.instance = instance;
      store.instanceState = {
        isClosed: instance?.dates?.closed,
        isArchived: instance.dates?.archived,
      };
      render();
    } catch (err) {
      await addErrorAlert(err.code ? t(`errorCode${err.code}`) : err.message);
      if (err.code === 6001) {
        history.push('/private/assignables/ongoing');
      }
    }
  }

  const getQuestionBadges = (question) => {
    const questionTypes = {
      likertScale: 'Likert',
      singleResponse: t('singleResponse'),
      multiResponse: t('multiResponse'),
      netPromoterScore: 'NPS',
      openResponse: t('openResponse'),
    };
    return (
      <Stack spacing={2}>
        <Badge label={questionTypes[question.type]} closable={false} />
        <Badge label={question.required ? t('required') : t('notRequired')} closable={false} />
      </Stack>
    );
  };

  const getQuestionIcons = (questionType, hasImage) => {
    const questionTypes = {
      likertScale: <PluginRankingIcon />,
      singleResponse: hasImage ? <FormImageIcon /> : <QuestionExclamationIcon />,
      multiResponse: hasImage ? <FormImageIcon /> : <QuestionExclamationIcon />,
      netPromoterScore: <GaugeDashboardIcon />,
      openResponse: <NavigationMenuLeftIcon />,
    };

    return questionTypes[questionType];
  };

  const renderQuestions = () => {
    const questionBoxs = store.feedback.questions.map((question, index) => (
      <ActivityAccordionPanel
        itemValue={question.id}
        label={
          <TextClamp>
            <Text role="productive" color="primary" stronger size="md">{`${index + 1}. ${htmlToText(
              question.question
            )}`}</Text>
          </TextClamp>
        }
        color="solid"
        icon={getQuestionIcons(question.type, question.properties.withImages)}
        key={question.id}
        rightSection={getQuestionBadges(question)}
      >
        <Box>
          {React.cloneElement(questionsByType[question.type], {
            question,
            responses: store.result.questionsInfo[question.id] || {},
            t,
          })}
        </Box>
      </ActivityAccordionPanel>
    ));
    return questionBoxs;
  };

  function getAvgTime() {
    const milliseconds = store.result.generalInfo.avgTimeOfCompletion;
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    seconds %= 60;
    minutes %= 60;
    hours %= 24;
    return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
  }

  function downloadDatasheet(format) {
    createDatasheet(store.feedback.name, store.feedback.questions, store.instanceId, format, {
      timeMarkerLabel: t('timeMarker'),
      option: t('optionPlaceholder'),
    });
  }

  const onCloseFeedback = async (closed) => {
    const newDates = {
      closed: closed ? new Date() : null,
    };
    if (dayjs(store.instance.dates.close).isBefore(dayjs())) {
      newDates.close = null;
    }
    try {
      await mutateAsync({ id: store.instanceId, dates: newDates });
      addSuccessAlert(closed ? t('closeAction.closedFeedback') : t('closeAction.openedFeedback'));
    } catch (e) {
      addErrorAlert(
        closed ? t('closeAction.errorClosingFeedback') : t('closeAction.errorOpeningFeedback')
      );
    }
  };

  const onArchiveFeedback = async (archived) => {
    const newDates = {
      archived: archived ? new Date() : null,
      // TODO: Do not close if not closable
      closed: archived && !store.instance.dates.deadline ? new Date() : undefined,
    };

    try {
      await mutateAsync({ id: store.instanceId, dates: newDates });
      addSuccessAlert(
        archived ? t('archiveAction.archivedFeedback') : t('archiveAction.unarchiedFeedback')
      );
    } catch (e) {
      addErrorAlert(
        archived
          ? t('archiveAction.errorArchivingFeedback')
          : t('archiveAction.errorUnarchivingFeedback')
      );
    }
  };

  React.useEffect(() => {
    if (params.id) init();
  }, [params.id]);

  if (store.loading) return null;

  return (
    <Stack justifyContent="center" fullWidth className={classes.root}>
      <Stack direction="column" spacing={4} className={classes.container}>
        {isTeacher && (
          <Stack justifyContent="space-between">
            <Stack spacing={5}>
              <Switch
                label={t('closeFeedback')}
                checked={store.instanceState.isClosed}
                onChange={onCloseFeedback}
              />
              <Switch
                label={t('archiveFeedback')}
                checked={store.instanceState.isArchived}
                onChange={onArchiveFeedback}
              />
            </Stack>
            <Stack spacing={3}>
              <Button
                variant="outline"
                rightIcon={<DownloadIcon />}
                onClick={() => downloadDatasheet('csv')}
              >
                CSV
              </Button>
              <Button
                variant="outline"
                rightIcon={<DownloadIcon />}
                onClick={() => downloadDatasheet('xls')}
              >
                XLS
              </Button>
            </Stack>
          </Stack>
        )}
        <Box className={classes.resultHeader}>
          <Title order={5} role="productive" color="quartiary">
            {t('feedback')}
          </Title>
          <Title order={3} style={{ marginTop: 2 }}>
            {store.feedback.name}
          </Title>
        </Box>
        <ActivityAccordion multiple state={accordionState} onChange={setAccordionState}>
          <ActivityAccordionPanel
            itemValue={'info'}
            label={t('generalInformation')}
            color="solid"
            icon={<DataFileBarsQuestionIcon />}
          >
            <Stack fullWidth fullHeight spacing={2} className={classes.generalInformation}>
              <Box className={classes.infoBox} style={{ maxWidth: 140 }}>
                <Text role="productive" color="primary" size="xs">
                  {t('started')}
                </Text>
                <Text className={classes.infoText}>{store.result.generalInfo.started}</Text>
              </Box>
              <Box className={classes.infoBox} style={{ maxWidth: 140 }}>
                <Text role="productive" color="primary" size="xs">
                  {t('sent')}
                </Text>
                <Text className={classes.infoText}>{store.result.generalInfo.finished}</Text>
              </Box>
              <Box className={classes.infoBox} style={{ maxWidth: 140 }}>
                <Text role="productive" color="primary" size="xs">
                  {t('completed')}
                </Text>
                <Text className={classes.infoText}>{`${
                  store.result.generalInfo.completionPercentage || 0
                }%`}</Text>
              </Box>
              <Box className={classes.infoBox}>
                <Text role="productive" color="primary" size="xs">
                  {t('timeToComplete')}
                </Text>
                <Text className={classes.infoText}>{getAvgTime()}</Text>
              </Box>
            </Stack>
          </ActivityAccordionPanel>
          {renderQuestions()}
        </ActivityAccordion>
      </Stack>
    </Stack>
  );
}
