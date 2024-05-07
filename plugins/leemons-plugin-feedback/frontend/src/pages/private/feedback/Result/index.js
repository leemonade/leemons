import React, { useRef } from 'react';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@feedback/helpers/prefixPN';
import { htmlToText, useStore } from '@common';
import { useHistory, useParams } from 'react-router-dom';
import {
  Badge,
  Box,
  Button,
  Stack,
  Text,
  TextClamp,
  Title,
  ContextContainer,
  TotalLayoutContainer,
  TotalLayoutStepContainer,
  TotalLayoutFooterContainer,
} from '@bubbles-ui/components';
import { getFeedbackRequest, getFeedbackResultsRequest } from '@feedback/request';
import getAssignableInstance from '@assignables/requests/assignableInstances/getAssignableInstance';
import { DownloadIcon } from '@bubbles-ui/icons/outline';
import { NPSStatistics } from '@feedback/pages/private/feedback/Result/components/NPSStatistics';
import { LikertStatistics } from '@feedback/pages/private/feedback/Result/components/LikertStatistics';
import { addErrorAlert } from '@layout/alert';
import { createDatasheet } from '@feedback/helpers/createDatasheet';
import ActivityHeader from '@assignables/components/ActivityHeader/index';
import useInstances from '@assignables/requests/hooks/queries/useInstances';

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

  const isTeacher = useIsTeacher();
  const history = useHistory();
  const params = useParams();
  const scrollRef = useRef();

  const { data: dynamicInstance } = useInstances({ id: params.id });
  const { classes } = ResultStyles({}, { name: 'Result' });

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
        <Badge closable={false} size="xs" className={classes.badge}>
          <Text className={classes.badgeText}>{questionTypes[question.type]?.toUpperCase()}</Text>
        </Badge>
        <Badge className={classes.badge} closable={false} size="xs">
          <Text className={classes.badgeText}>
            {question.required ? t('required').toUpperCase() : t('notRequired').toUpperCase()}
          </Text>
        </Badge>
      </Stack>
    );
  };

  const renderQuestions = () =>
    store.feedback.questions.map((question, index) => (
      <ContextContainer key={question.id} spacing={3} className={classes.questionContainer}>
        <Stack justifyContent="space-between" alignItems="center" fullWidth>
          <TextClamp>
            <Title sx={(theme) => ({ ...theme.other.global.content.typo.heading.md })}>{`${
              index + 1
            }. ${htmlToText(question.question)}`}</Title>
          </TextClamp>
          {getQuestionBadges(question)}
        </Stack>

        <Box>
          {React.cloneElement(questionsByType[question.type], {
            question,
            responses: store.result.questionsInfo[question.id] || {},
            t,
          })}
        </Box>
      </ContextContainer>
    ));

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

  React.useEffect(() => {
    if (params.id) init();
  }, [params.id]);

  if (store.loading) return null;

  return (
    <TotalLayoutContainer
      scrollRef={scrollRef}
      Header={
        <ActivityHeader
          instance={dynamicInstance}
          showClass
          showRole
          showEvaluationType
          showTime
          showDeadline
          action={t('evaluation')}
          showCloseButtons={isTeacher}
          allowEditDeadline={isTeacher}
        />
      }
    >
      <Stack justifyContent="center" ref={scrollRef} style={{ overflowY: 'auto' }}>
        <TotalLayoutStepContainer
          Footer={
            isTeacher && (
              <TotalLayoutFooterContainer
                fixed
                scrollRef={scrollRef}
                rightZone={
                  <>
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
                  </>
                }
              />
            )
          }
        >
          <ContextContainer title={t('responsesTitleLabel')} sx={{ gap: '24px' }}>
            {/* General Information */}
            <ContextContainer spacing={0} className={classes.questionContainer}>
              <TextClamp>
                <Title sx={(theme) => ({ ...theme.other.global.content.typo.heading.md })}>
                  {t('generalInformation')}
                </Title>
              </TextClamp>
              <Stack fullWidth fullHeight spacing={2} className={classes.generalInformation}>
                <Box className={classes.infoBox} style={{ maxWidth: 140 }}>
                  <Text className={classes.infoText}>{store.result.generalInfo.started}</Text>
                  <Text role="productive" color="primary" size="xs">
                    {t('started')}
                  </Text>
                </Box>
                <Box className={classes.infoBox} style={{ maxWidth: 140 }}>
                  <Text className={classes.infoText}>{store.result.generalInfo.finished}</Text>
                  <Text role="productive" color="primary" size="xs">
                    {t('sent')}
                  </Text>
                </Box>
                <Box className={classes.infoBox} style={{ maxWidth: 140 }}>
                  <Text className={classes.infoText}>{`${
                    store.result.generalInfo.completionPercentage || 0
                  }%`}</Text>
                  <Text role="productive" color="primary" size="xs">
                    {t('completed')}
                  </Text>
                </Box>
                <Box className={classes.infoBox}>
                  <Text className={classes.infoText}>{getAvgTime()}</Text>
                  <Text role="productive" color="primary" size="xs">
                    {t('timeToComplete')}
                  </Text>
                </Box>
              </Stack>
            </ContextContainer>

            {/* Questions */}
            {renderQuestions()}
          </ContextContainer>
        </TotalLayoutStepContainer>
      </Stack>
    </TotalLayoutContainer>
  );
}
