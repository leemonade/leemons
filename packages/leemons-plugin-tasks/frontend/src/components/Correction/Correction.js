import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';
import _ from 'lodash';
import { Box, Button, Text } from '@bubbles-ui/components';
import useProgramEvaluationSystem from '@assignables/hooks/useProgramEvaluationSystem';
import { unflatten } from '@common';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { CutStarIcon, StarIcon } from '@bubbles-ui/icons/solid';
import { CorrectionStyles } from './Correction.style';
import Submission from './components/Submission';
import { prefixPN } from '../../helpers';
import SubjectTabs from './components/SubjectTabs';
import Accordion from './components/Accordion';
import updateStudentRequest from '../../request/instance/updateStudent';

function getActivityType(instance) {
  const { gradable, allowFeedback, requiresScoring } = instance;
  if (gradable) {
    return 'calificable';
  }
  if (!gradable && requiresScoring) {
    return 'evaluable';
  }
  if (allowFeedback && !requiresScoring) {
    return 'noPunctuationEvaluable';
  }
  return '';
}

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
  const { classes, theme } = CorrectionStyles();

  return (
    <>
      <Box className={classes.mainContent}>
        <Box className={classes.type}>
          <Text color="secondary">{labels?.types?.[getActivityType(instance)] || ''}</Text>
          {instance?.gradable ? (
            <StarIcon
              style={{
                color: theme.colors.text02,
              }}
            />
          ) : (
            <CutStarIcon
              style={{
                color: theme.colors.text02,
              }}
            />
          )}
        </Box>
        <Submission assignation={assignation} labels={labels.submission} />
        <SubjectTabs assignation={assignation} instance={instance} loading={loading}>
          <Accordion
            classes={classes}
            evaluationSystem={evaluationSystem}
            labels={labels}
            instance={instance}
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
