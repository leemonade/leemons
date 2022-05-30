import React, { useMemo } from 'react';
import {
  Box,
  ActivityAccordion,
  ActivityAccordionPanel,
  HtmlText,
  ScoreFeedback,
  Text,
  Title,
} from '@bubbles-ui/components';
import _ from 'lodash';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { PluginComunicaIcon } from '@bubbles-ui/icons/outline';
import SubjectTabs from '../Correction/components/SubjectTabs';
import studentCorrectionStyles from './StudentCorrection.style';
import Submission from '../Correction/components/Submission';
import { prefixPN } from '../../helpers';
import ContactTeacher from './components/ContactTeacher/ContactTeacher';

function SubjectTab({ assignation, subject, labels, classes, evaluationSystem }) {
  const grade = assignation?.grades?.find(({ subject: s }) => s === subject);

  if (!grade) {
    return (
      <Box className={classes?.notCorrected}>
        <Text>{labels?.subjectNotCorrectedYet}</Text>
      </Box>
    );
  }
  return (
    <>
      <ScoreFeedback calification={{ grade: grade?.grade, label: null, minimumGrade: 5 }}>
        <Box className={classes?.scoreFeedbackContent}>
          <Title order={4} color="secondary">
            Task
          </Title>
          <Title order={3} color="primary">
            {assignation?.instance?.assignable?.asset?.name}
          </Title>
        </Box>
      </ScoreFeedback>
      {grade?.feedback && (
        <ActivityAccordion>
          <ActivityAccordionPanel label={labels?.feedbackForStudent} icon={<PluginComunicaIcon />}>
            <Box className={classes?.accordionPanel}>
              <Box className={classes?.feedbackContainer}>
                <HtmlText>{grade?.feedback}</HtmlText>
              </Box>
            </Box>
          </ActivityAccordionPanel>
        </ActivityAccordion>
      )}
      <ContactTeacher assignation={assignation} subject={subject} labels={labels?.contactTeacher} />
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

  return (
    <Box className={classes?.root}>
      <Submission assignation={assignation} labels={labels?.submission} />
      <SubjectTabs assignation={assignation} instance={assignation?.instance}>
        <SubjectTab labels={labels} classes={classes} />
      </SubjectTabs>
    </Box>
  );
}
