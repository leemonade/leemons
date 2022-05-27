import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';
import _ from 'lodash';
import { Box, Button } from '@bubbles-ui/components';
import useProgramEvaluationSystem from '@assignables/hooks/useProgramEvaluationSystem';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { CorrectionStyles } from './Correction.style';
import Submission from './components/Submission';
import { prefixPN } from '../../helpers';
import SubjectTabs from './components/SubjectTabs';
import Accordion from './components/Accordion';
import updateStudentRequest from '../../request/instance/updateStudent';

export default function Correction({ assignation, instance, loading }) {
  /*
    --- UI informative hooks ---
  */
  const [loadingButton, setLoadingButton] = useState(null);
  const isLoading = (key) => loadingButton === key;
  const setLoading = (key) => {
    setLoadingButton((l) => {
      if (l === key) {
        return null;
      }
      return key;
    });
  };

  /*
    --- Form Hooks ---
  */
  const { handleSubmit, getValues, reset } = useFormContext();

  useEffect(() => {
    if (!assignation) {
      return;
    }

    const values = getValues();

    const empty = _.mapValues(values, () => null);
    const grades = assignation.grades || [];
    const mainGrades = grades.filter(({ type }) => type === 'main');
    const gradesObject = mainGrades.reduce((acc, { subject, grade, feedback }) => {
      acc[subject] = { score: grade, feedback };
      return acc;
    }, {});

    reset({ ...empty, ...gradesObject });
  }, [assignation]);

  /*
    --- Translate Hooks ---
  */
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

  /*
    --- Evaluation Systems Hooks ---
  */
  const evaluationSystem = useProgramEvaluationSystem(assignation?.instance);

  const scoreInputProps = useMemo(() => {
    if (!evaluationSystem) {
      return null;
    }

    return {
      showLetters: evaluationSystem.type === 'letter',
      acceptCustom: evaluationSystem.type === 'letter' ? 'text' : 'number',
      grades: evaluationSystem.scales.map((scale) => ({
        score: scale.number,
        letter: scale.letter,
      })),
      tags: evaluationSystem.tags,
      evaluation: evaluationSystem.id,
    };
  }, [evaluationSystem]);

  /*
    --- Handlers ---
  */
  const onSave = (sendToStudent, key) => async (data) => {
    if (loadingButton) {
      return;
    }

    setLoading(key);

    try {
      const grades = Object.entries(data).map(([id, { score, feedback }]) => ({
        subject: id,
        grade: score,
        feedback,
        type: 'main',
        visibleToStudent: sendToStudent,
      }));

      // TODO: Do something with sendToStudent

      await updateStudentRequest({
        instance: assignation.instance.id,
        student: assignation.user,
        grades,
      });
      if (sendToStudent) {
        addSuccessAlert(labels.saveAndSendMessage);
      } else {
        addSuccessAlert(labels?.saveMessage);
      }
    } catch (e) {
      addErrorAlert(labels?.saveError?.replace('{{error}}', e.message));
    } finally {
      setLoading(key);
    }
  };

  /*
    --- Render ---
  */
  const { classes } = CorrectionStyles();

  return (
    <>
      <Box className={classes.mainContent}>
        <Submission assignation={assignation} labels={labels.submission} />
        <SubjectTabs assignation={assignation} instance={instance} loading={loading}>
          <Accordion
            classes={classes}
            evaluationSystem={evaluationSystem}
            labels={labels}
            scoreInputProps={scoreInputProps}
          />
        </SubjectTabs>
      </Box>
      <Box className={classes?.mainButtons}>
        <Button
          variant="outline"
          loading={isLoading('save')}
          disabled={loadingButton && !isLoading('save')}
          onClick={handleSubmit(onSave(false, 'save'))}
        >
          {labels?.save}
        </Button>
        <Button
          loading={isLoading('saveAndSend')}
          disabled={loadingButton && !isLoading('saveAndSend')}
          onClick={handleSubmit(onSave(true, 'saveAndSend'))}
        >
          {labels?.saveAndSend}
        </Button>
      </Box>
    </>
  );
}
