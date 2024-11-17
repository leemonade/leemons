import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  Box,
  Button,
  ContextContainer,
  HtmlText,
  Text,
  Title,
  TotalLayoutFooterContainer,
  TotalLayoutStepContainer,
} from '@bubbles-ui/components';
import dayjs from 'dayjs';
import * as duration from 'dayjs/plugin/duration';
import { ChevRightIcon } from '@bubbles-ui/icons/outline';

import { find, map } from 'lodash';
import { useCurriculumVisibleValues } from '@assignables/components/Assignment/components/EvaluationType';
import { useClassesSubjects } from '@academic-portfolio/hooks';
import { CurriculumListContents } from '@curriculum/components/CurriculumListContents';
import { Instructions } from '@tests/pages/private/tests/StudentInstance/components/Instructions';
import InfoCard from './InfoCard';

dayjs.extend(duration);
export default function Development(props) {
  const { styles, cx, t, store, nextStep, onStartQuestions } = props;

  const canStart = React.useMemo(() => {
    if (store.instance.dates?.start) {
      const now = new Date();
      const start = new Date(store.instance.dates.start);
      if (now < start) {
        return false;
      }
    }
    return true;
  }, [store.instance.dates?.start]);

  let clueEl = null;
  let clueText = null;
  const cluePer = find(store.config.clues, (cl) => cl.canUse);

  if (cluePer) {
    const cluePoints = store.questionsInfo.perQuestionNumber * (cluePer.value / 100);
    clueText =
      cluePer.value !== 0
        ? t('clueWithPer', {
            per: cluePer.value,
            points: `-${cluePoints.toFixed(2)}`,
          })
        : t('clueWithoutPer');
    clueEl = (
      <Box className={styles.resumeBoxContainer}>
        <InfoCard
          cx={cx}
          icon="/public/tests/hint.png"
          styles={styles}
          withRedColor={cluePer.value !== 0}
          label={clueText}
        />
      </Box>
    );
  }

  const tabPanelStyle = (theme) => ({ marginLeft: theme.spacing[3] });

  const curriculumValues = useCurriculumVisibleValues({ assignation: store.assignation });
  const subjects = useClassesSubjects(store.instance.classes);

  let curriculum = null;
  if (curriculumValues.length && curriculumValues[0]?.curriculum?.curriculum) {
    curriculum = curriculumValues[0].curriculum.curriculum;
  }

  return (
    <TotalLayoutStepContainer
      stepName={t('development')}
      Footer={
        <TotalLayoutFooterContainer
          fixed
          scrollRef={props.scrollRef}
          rightZone={
            <Button
              variant="outline"
              rightIcon={<ChevRightIcon />}
              disabled={!canStart}
              onClick={() => {
                nextStep();
                onStartQuestions();
              }}
            >
              {t('nextButton')}
            </Button>
          }
        />
      }
    >
      <ContextContainer spacing={8}>
        {!canStart ? (
          <Alert closeable={false} title={t('activityNotAvailable')}>
            {t('informationStart', {
              date: `${dayjs(store.instance.dates.start).format('L ')}`,
              hour: `${dayjs(store.instance.dates.start).format('HH:mm ')}`,
            })}
          </Alert>
        ) : null}

        {store.instance?.assignable?.statement ? (
          <ContextContainer title={t('resume')}>
            <HtmlText>{store.instance.assignable.statement}</HtmlText>
          </ContextContainer>
        ) : null}

        <Instructions instance={store.instance} />

        <Box className={styles.resumeBoxContainer}>
          <InfoCard
            cx={cx}
            styles={styles}
            number={store.questionsInfo.questions}
            label={t('questions')}
          />
          <InfoCard
            cx={cx}
            styles={styles}
            number={store.questionsInfo.perQuestion}
            label={t('perQuestion')}
          />
          {store.questionsInfo.minPoints !== 0 ? (
            <InfoCard
              cx={cx}
              styles={styles}
              number={store.questionsInfo.minPoints}
              label={t('minScore')}
            />
          ) : null}
          <InfoCard
            cx={cx}
            styles={styles}
            number={store.questionsInfo.totalPoints}
            label={t('maxScore')}
          />
          <InfoCard
            cx={cx}
            styles={styles}
            number={store.questionsInfo.minToApprove}
            label={t('minToApprove')}
          />
        </Box>

        <ContextContainer title={t('penalties')}>
          <Box sx={() => ({ marginLeft: 20 })}>
            <ul style={{ listStyle: 'disc' }}>
              <li>
                <Text>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: store.config.canOmitQuestions
                        ? store.config.omit
                          ? t('blankQuestionsScores', {
                              per: store.config.omit,
                              points: store.questionsInfo.perOmitQuestion,
                            })
                          : t('blankQuestions')
                        : t('noBlankQuestions'),
                    }}
                  />
                </Text>
              </li>
              <li>
                <Text>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: store.config.wrong
                        ? t('errorQuestions', {
                            per: store.config.wrong,
                            points: store.questionsInfo.perErrorQuestion,
                          })
                        : t('noErrorQuestions'),
                    }}
                  />
                </Text>
              </li>
              {clueText ? (
                <li>
                  <Text>
                    <span dangerouslySetInnerHTML={{ __html: clueText }} />
                  </Text>
                </li>
              ) : null}
            </ul>
          </Box>
        </ContextContainer>

        {!!curriculum?.length ||
        (!!store.instance.assignable.subjects[0]?.curriculum.objectives &&
          !!store.instance.assignable.subjects[0]?.curriculum.objectives?.length) ? (
          <ContextContainer title={t('curriculum')}>
            {curriculum?.length ? (
              <Box sx={tabPanelStyle}>
                <Box>
                  <CurriculumListContents value={curriculum} subjects={map(subjects, 'id')} />
                </Box>
              </Box>
            ) : null}
            {!!store.instance.assignable.subjects[0]?.curriculum.objectives &&
            !!store.instance.assignable.subjects[0]?.curriculum.objectives?.length ? (
              <Box sx={tabPanelStyle}>
                <Box>
                  <Title color="primary" order={5}>
                    {t('objectives')}
                  </Title>
                  {/* TODO: Use react lists */}
                  <HtmlText>
                    {`
                      <ul>
                      ${store.instance.assignable.subjects[0]?.curriculum.objectives
                        ?.map(
                          ({ objective }) =>
                            `<li>
                            ${objective}
                          </li>`
                        )
                        ?.join('')}
                      </ul>
                    `}
                  </HtmlText>
                </Box>
              </Box>
            ) : null}
          </ContextContainer>
        ) : null}
      </ContextContainer>

      <Box className={styles.timeLimitContainer}>
        {/*
        <Box className={cx(classes.loremIpsum, classes.limitedWidthStep)}>
          <Box className={styles.resumeBoxContainer}>
            <InfoCard
              cx={cx}
              icon="/public/tests/blank-questions.png"
              styles={styles}
              withRedColor={
                !store.config.canOmitQuestions ||
                (store.config.canOmitQuestions && store.config.omit)
              }
              label={
                // eslint-disable-next-line no-nested-ternary
                store.config.canOmitQuestions
                  ? store.config.omit
                    ? t('blankQuestionsScores', {
                        per: store.config.omit,
                        points: store.questionsInfo.perOmitQuestion,
                      })
                    : t('blankQuestions')
                  : t('noBlankQuestions')
              }
            />
          </Box>

          <Box className={styles.resumeBoxContainer}>
            <InfoCard
              cx={cx}
              icon="/public/tests/error-questions.png"
              styles={styles}
              withRedColor={store.config.wrong}
              label={
                store.config.wrong
                  ? t('errorQuestions', {
                      per: store.config.wrong,
                      points: store.questionsInfo.perErrorQuestion,
                    })
                  : t('noErrorQuestions')
              }
            />
          </Box>

          {clueEl}
        </Box>
        */}
      </Box>
    </TotalLayoutStepContainer>
  );
}

Development.propTypes = {
  classes: PropTypes.any,
  styles: PropTypes.any,
  t: PropTypes.any,
  cx: PropTypes.any,
  store: PropTypes.any,
  prevStep: PropTypes.func,
  nextStep: PropTypes.func,
  isFirstStep: PropTypes.bool,
  onStartQuestions: PropTypes.func,
};
