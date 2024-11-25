import { useMemo, useState } from 'react';

import { Stack, Text, RadioGroup, createStyles } from '@bubbles-ui/components';
import { TextEditorInput, TEXT_EDITOR_TEXTAREA_TOOLBARS } from '@bubbles-ui/editors';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import PropTypes from 'prop-types';

import prefixPN from '@tests/helpers/prefixPN';

const useTeacherReviewStyles = createStyles((theme) => ({
  container: {
    marginTop: 16,
    gap: 16,
  },
}));

export default function TeacherReview({ userAnswer, studentSkipped }) {
  const [t] = useTranslateLoader(prefixPN('testResult.responseDetail'));
  const [teacherFeedback, setTeacherFeedback] = useState('');
  const [questionStatus, setQuestionStatus] = useState(null);
  const { classes } = useTeacherReviewStyles();

  const radioData = useMemo(
    () => [
      {
        value: 'ok',
        label: 'Correcta',
      },
      {
        value: 'partial',
        label: 'Parcialmente correcta',
      },
      {
        value: 'ko',
        label: 'Incorrecta',
      },
    ],
    []
  );
  // TODO PAOLA: use hook to modify the questionResponses.status. Similar to a student answering but simpler
  // Footer must have a save correction button. this has to change from above in Question

  return (
    <Stack className={classes.container} direction="column">
      <Stack spacing={2} direction="column">
        <Text role="productive" color="primary" strong>
          {t('answer')}
        </Text>
        <Text>{userAnswer}</Text>
      </Stack>

      {!studentSkipped && (
        <Stack direction="column" spacing={2}>
          <Text role="productive" color="primary" strong>
            {t('gradeAndFeedback')}
          </Text>
          <RadioGroup data={radioData} onChange={setQuestionStatus} />

          <TextEditorInput
            required
            toolbars={TEXT_EDITOR_TEXTAREA_TOOLBARS}
            value={teacherFeedback}
            onChange={setTeacherFeedback}
            placeholder={t('feedbackPlaceholder')}
            editorStyles={{ minHeight: 80 }}
          />
        </Stack>
      )}
    </Stack>
  );
}

TeacherReview.propTypes = {
  userAnswer: PropTypes.string,
};
