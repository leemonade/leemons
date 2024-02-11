import {
  ActivityAccordion,
  ActivityAccordionPanel,
  Box,
  Button,
  ContextContainer,
  HtmlText,
  Text,
  TotalLayoutContainer,
  TotalLayoutStepContainer,
  TotalLayoutFooterContainer,
  Stack,
  Alert,
  Tabs,
  TabPanel,
} from '@bubbles-ui/components';
import { ChevRightIcon } from '@bubbles-ui/icons/outline';
import { useSearchParams } from '@common';

import React, { useMemo, useRef, useState } from 'react';
import ActivityHeader from '@assignables/components/ActivityHeader';
import { isEmpty } from 'lodash';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { prefixPN } from '@tasks/helpers';
import { useHistory, Link } from 'react-router-dom';
import { DocumentIcon } from '@content-creator/components';
import { CurriculumIcon } from '@tasks/assets/images/CurriculumIcon';
import useNextActivityUrl from '@assignables/hooks/useNextActivityUrl';
import EvaluationFeedback from '@assignables/components/EvaluationFeedback/EvaluationFeedback';
import { AssetEmbedList } from '@leebrary/components/AssetEmbedList';
import { SubjectItemDisplay } from '@academic-portfolio/components';
import { useClassesSubjects } from '@academic-portfolio/hooks';
import { ChatDrawer } from '@comunica/components';
import hooks from 'leemons-hooks';
import TimeoutAlert from '@assignables/components/EvaluationFeedback/TimeoutAlert';
import CurriculumRender from '../Student/TaskDetail/components/IntroductionStep/components/CurriculumRender/CurriculumRender';
import { useStudentCorrectionStyles } from './StudentCorrection.style';
import { TextIcon } from '../../assets/images/TextIcon';
import LinkSubmission from '../Correction/components/LinkSubmission/LinkSubmission';

function SubjectTab({ assignation, subject, t }) {
  const [chatOpened, setChatOpened] = useState(false);
  const room = `assignables.subject|${subject}.assignation|${assignation?.id}.userAgent|${assignation?.user}`;

  const isEvaluated = useMemo(
    () =>
      !!assignation?.grades?.find((grade) => grade.type === 'main' && grade.subject === subject),
    [assignation?.grades, subject]
  );

  if (!isEvaluated) {
    return (
      <Alert severity="warning" title={t('pending_evaluation_alert.title')} closeable={false}>
        {t('pending_evaluation_alert.message')}
      </Alert>
    );
  }

  return (
    <>
      <EvaluationFeedback
        assignation={assignation}
        subject={subject}
        onChatClick={() => {
          hooks.fireEvent('chat:openDrawer', { room });
          setChatOpened(true);
        }}
      />

      <ChatDrawer
        onClose={() => {
          hooks.fireEvent('chat:closeDrawer');
          setChatOpened(false);
        }}
        opened={chatOpened}
        room={room}
      />
    </>
  );
}

export default function StudentCorrection({ assignation }) {
  const [t] = useTranslateLoader(prefixPN('task_correction.student'));
  const [buttonsT] = useTranslateLoader(prefixPN('task_realization.buttons'));

  const scrollRef = useRef();
  const params = useSearchParams();
  const fromExecution = useMemo(() => params.has('fromExecution'), []);
  const history = useHistory();

  const { instance } = assignation ?? {};
  const { assignable } = instance ?? {};

  const subjects = useClassesSubjects(instance?.classes);

  const hasSubmission = !!assignable?.submission;
  const activitySubmitted = !!assignation?.metadata?.submission;
  const nextActivityUrl = useNextActivityUrl(assignation);

  const submissionAssetsIds = useMemo(() => {
    if (assignable?.submission?.type === 'File') {
      return assignation?.metadata?.submission?.map((file) => file.id);
    }
    return [];
  });

  const isEvaluated = useMemo(
    () => !!assignation?.grades?.find((grade) => grade.type === 'main'),
    [assignation?.grades]
  );

  const { classes } = useStudentCorrectionStyles();

  return (
    <TotalLayoutContainer
      scrollRef={scrollRef}
      Header={
        <ActivityHeader
          instance={instance}
          showClass
          showRole
          showEvaluationType
          showTime
          showDeadline
        />
      }
    >
      <Stack justifyContent="center" style={{ overflow: 'auto' }} ref={scrollRef}>
        <TotalLayoutStepContainer
          Footer={
            fromExecution &&
            !!instance?.metadata?.module && (
              <TotalLayoutFooterContainer
                scrollRef={scrollRef}
                fixed
                rightZone={
                  <Link
                    to={
                      nextActivityUrl ??
                      `/private/learning-paths/modules/dashboard/${instance?.metadata?.module?.id}`
                    }
                  >
                    <Button rightIcon={!!nextActivityUrl && <ChevRightIcon />}>
                      {nextActivityUrl ? buttonsT('nextActivity') : buttonsT('goToModule')}
                    </Button>
                  </Link>
                }
              />
            )
          }
        >
          <Box className={classes.root}>
            <Stack direction="column" spacing="xl">
              {params.has('fromTimeout') && (
                <TimeoutAlert
                  onClose={() => {
                    params.delete('fromTimeout');

                    history.replace({ search: params.toString() });
                  }}
                />
              )}
              {params.has('fromExecution') && (
                <Alert
                  severity="success"
                  title={t('submitted_alert.title')}
                  onClose={() => {
                    params.delete('fromExecution');
                    history.replace({ search: params.toString() });
                  }}
                >
                  {t('submitted_alert.message')}
                </Alert>
              )}
              {!isEvaluated && (
                <Alert
                  severity="warning"
                  title={t('pending_evaluation_alert.title')}
                  closeable={false}
                >
                  {t('pending_evaluation_alert.message')}
                </Alert>
              )}

              {!!isEvaluated &&
                (subjects?.length > 1 ? (
                  <Tabs>
                    {subjects.map((subject) => (
                      <TabPanel
                        key={subject.id}
                        label={<SubjectItemDisplay subjectsIds={[subject.id]} />}
                      >
                        <ContextContainer
                          sx={(theme) => ({ marginTop: theme.other.global.spacing.padding.lg })}
                        >
                          <SubjectTab assignation={assignation} subject={subject.id} t={t} />
                        </ContextContainer>
                      </TabPanel>
                    ))}
                  </Tabs>
                ) : (
                  <SubjectTab assignation={assignation} subject={subjects?.[0]?.id} t={t} />
                ))}
            </Stack>
            {!!hasSubmission && (
              <Box>
                <ContextContainer title={t('submission')}>
                  {assignable?.submission?.type === 'Link' &&
                    (activitySubmitted ? (
                      <LinkSubmission assignation={assignation} />
                    ) : (
                      <Text>{t('no_submission')}</Text>
                    ))}

                  {assignable?.submission?.type === 'File' &&
                    (activitySubmitted ? (
                      <AssetEmbedList assets={submissionAssetsIds} />
                    ) : (
                      <Text>{t('no_submission')}</Text>
                    ))}
                </ContextContainer>
              </Box>
            )}

            <Box>
              <ContextContainer title={t('activity_summary')}>
                <ActivityAccordion>
                  <ActivityAccordionPanel label={t('statement')} icon={<TextIcon />}>
                    <Box className={classes?.accordionPanel}>
                      <HtmlText>{assignable?.statement}</HtmlText>
                    </Box>
                  </ActivityAccordionPanel>
                  {!isEmpty(instance?.curriculum) && (
                    <ActivityAccordionPanel label={t('curriculum')} icon={<CurriculumIcon />}>
                      <Box className={classes?.accordionPanel}>
                        <CurriculumRender
                          instance={instance}
                          showCurriculum={instance?.curriculum ?? {}}
                          withoutTitle
                        />
                      </Box>
                    </ActivityAccordionPanel>
                  )}
                  {!!assignable?.metadata?.development?.length && (
                    <ActivityAccordionPanel label={t('development')} icon={<DocumentIcon />}>
                      <Box className={classes?.accordionPanel}>
                        {(assignable?.metadata?.development || []).map(({ development }, i) => (
                          <HtmlText key={i}>{development}</HtmlText>
                        ))}
                      </Box>
                    </ActivityAccordionPanel>
                  )}
                </ActivityAccordion>
              </ContextContainer>
            </Box>
          </Box>
        </TotalLayoutStepContainer>
      </Stack>
    </TotalLayoutContainer>
  );
}
