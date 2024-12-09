import { Controller } from 'react-hook-form';

import { Text, ContextContainer, Checkbox } from '@bubbles-ui/components';
import propTypes from 'prop-types';

export default function OpenResponseRules({ control, classes, t }) {
  return (
    <ContextContainer className={classes.questionConfigContainer} spacing={2}>
      <Text className={classes.questionConfigTitle}>
        {t('rulesByQuestionType.openResponse.title')}
      </Text>
      <Controller
        control={control}
        name="questionFilters.openResponse.enableTeacherReviewFeedback"
        render={({ field }) => (
          <Checkbox
            label={t('rulesByQuestionType.openResponse.enableTeacherReviewFeedback')}
            {...field}
            checked={field.value}
          />
        )}
      />
    </ContextContainer>
  );
}

OpenResponseRules.propTypes = {
  control: propTypes.object,
  classes: propTypes.object,
  t: propTypes.func,
};
