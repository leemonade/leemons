import { useClassesSubjects } from '@academic-portfolio/hooks';
import { useCurriculumVisibleValues } from '@assignables/components/Assignment/components/EvaluationType';
import { Box, HtmlText, Title } from '@bubbles-ui/components';
import { CurriculumListContents } from '@curriculum/components/CurriculumListContents';
import dayjs from 'dayjs';
import { isEmpty, map } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { ButtonNavigation } from './ButtonNavigation';

export default function Resume(props) {
  const { classes, cx, t, store, styles } = props;

  let canStart = true;

  if (store.instance.dates?.start) {
    const now = new Date();
    const start = new Date(store.instance.dates.start);
    if (now < start) {
      canStart = false;
    }
  }

  const curriculumValues = useCurriculumVisibleValues({ assignation: store.assignation });
  const subjects = useClassesSubjects(store.instance.classes);

  let curriculum = null;
  if (curriculumValues.length && curriculumValues[0]?.curriculum?.curriculum) {
    curriculum = curriculumValues[0].curriculum.curriculum;
  }

  const tabPanelStyle = (theme) => ({ marginLeft: theme.spacing[3] });

  return (
    <Box className={cx(classes.loremIpsum, classes.limitedWidthStep)}>
      {store.instance?.assignable?.statement ? (
        <>
          <Title order={2}>{t('resume')}</Title>
          <Box sx={(theme) => ({ marginTop: theme.spacing[4], marginBottom: theme.spacing[4] })}>
            <HtmlText>{store.instance.assignable.statement}</HtmlText>
          </Box>
        </>
      ) : null}

      {!isEmpty(store.instance?.assignable?.subjects?.[0]?.curriculum) ? (
        <>
          {/* <Tabs>
          <TabPanel label={subjects?.[0]?.name}>
            <Box sx={(theme) => ({ marginTop: theme.spacing[4] })} />
            */}
          <Box
            sx={(theme) => ({
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing[4],
            })}
          >
            {curriculum ? (
              <Box sx={tabPanelStyle}>
                <Box>
                  <CurriculumListContents value={curriculum} subjects={map(subjects, 'id')} />
                </Box>
              </Box>
            ) : null}
            {!!store.instance.assignable.subjects[0].curriculum.objectives &&
              !!store.instance.assignable.subjects[0].curriculum.objectives?.length ? (
              <Box sx={tabPanelStyle}>
                <Box>
                  <Title color="primary" order={5}>
                    {t('objectives')}
                  </Title>
                  {/* TODO: Use react lists */}
                  <HtmlText>
                    {`
                      <ul>
                      ${store.instance.assignable.subjects[0].curriculum.objectives
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
          </Box>
          {/* </TabPanel>
        </Tabs> */}
        </>
      ) : null}

      {canStart ? (
        <ButtonNavigation {...props} />
      ) : (
        <Box className={styles.timeLimitContainer} style={{ margin: 0 }}>
          <Title order={5}>{t('importantInformation')}</Title>
          <Box className={styles.timeLimitContent}>
            <Box
              className={styles.timeLimitInfo}
              sx={(theme) => ({
                paddingLeft: theme.spacing[6],
                gap: theme.spacing[4],
                // textAlign: 'left',
                textAlign: 'center',
                flexDirection: 'column',
              })}
            >
              <Box>{t('informationOnlyView')}</Box>
              <Box>
                {t('informationStart', {
                  date: `${dayjs(store.instance.dates.start).format('L - HH:mm ')}h`,
                })}
              </Box>
            </Box>
            {/* <img className={styles.timeLimitImage} src="/public/tests/ninaBrazoLevantado.png" /> */}
          </Box>
        </Box>
      )}
    </Box>
  );
}

Resume.propTypes = {
  classes: PropTypes.any,
  t: PropTypes.any,
  cx: PropTypes.any,
  store: PropTypes.any,
  prevStep: PropTypes.func,
  nextStep: PropTypes.func,
  isFirstStep: PropTypes.bool,
  styles: PropTypes.any,
};
